import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnglishLearningService, Kullanici } from '../services/english-learning.service';
import { KullaniciFormModalComponent, FormData } from './kullanici-form-modal.component';

@Component({
    selector: 'app-english-learning',
    imports: [CommonModule, FormsModule, KullaniciFormModalComponent],
    templateUrl: './english-learning.component.html',
    styleUrls: ['./english-learning.component.scss']
})
export class EnglishLearningComponent implements OnInit, OnDestroy {
  users: Kullanici[] = [];
  filteredUsers: Kullanici[] = [];
  loading = false;
  error: string | null = null;
  deleting = false;
  deleteId: number | null = null;
  modalError: string | null = null;

  // Modal state'leri
  isModalOpen = false;
  isEditMode = false;
  selectedKullanici: Kullanici | null = null;
  isSaving = false;
  
  // Arama ve filtre değişkenleri
  searchName = '';
  filters = {
    id: '',
    isim: '',
    email: '',
    kayitTarihi: ''
  };

  // Sıralama değişkenleri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Yenileme countdown
  lastRefreshTime = new Date();
  countdown = 120;
  private countdownInterval: any;

  constructor(private svc: EnglishLearningService) {}

  ngOnInit(): void {
    this.search();
   // this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  deleteUser(id: number): void {
    if (confirm(`ID: ${id} olan kullanıcıyı silmek istediğinize emin misiniz?`)) {
      this.deleting = true;
      this.deleteId = id;
      this.svc.deleteKullanici(id).subscribe({
        next: (res) => {
          if (res && (res as any).success === false) {
            this.error = (res as any).message || 'Kullanıcı silinemedi.';
          } else {
            this.error = null;
            this.search();
          }
          this.deleting = false;
          this.deleteId = null;
        },
        error: (err) => {
          console.error('Delete error', err);
          this.error = err?.error?.message || err?.message || 'Silme işlemi sırasında hata oluştu.';
          this.deleting = false;
          this.deleteId = null;
        }
      });
    }
  }

  search() {
    this.loading = true;
    this.error = null;
    this.svc.getKullanicilar().subscribe({
      next: (res) => {
        if (res && (res as any).success === false) {
          this.error = (res as any).message || 'Veri alınamadı.';
          this.users = [];
          this.filteredUsers = [];
        } else {
          this.users = res.data || [];
          this.filteredUsers = [...this.users];
          this.lastRefreshTime = new Date();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('API error', err);
        if (err.status === 0) {
          this.error = 'Sunucuya bağlanamadı. Lütfen internet bağlantınızı kontrol edin ya da proxy yapılandırmasını kullanın.';
        } else {
          // Try to show server-provided message if present
          this.error = err?.error?.message || err?.message || 'Veri alınırken hata oluştu.';
        }
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    // If input is empty, load all users
    if (!this.searchName || !this.searchName.toString().trim()) {
      this.search();
      return;
    }

    const id = Number(this.searchName);
    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'Lütfen geçerli bir ID girin.';
      this.filteredUsers = [];
      return;
    }

    this.loading = true;
    this.error = null;
    this.svc.getKullaniciById(id).subscribe({
      next: (res) => {
        if (res && (res as any).success === false) {
          this.error = (res as any).message || 'Kullanıcı bulunamadı.';
          this.filteredUsers = [];
        } else {
          const u = res.data ? [res.data] : [];
          this.filteredUsers = u;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Kullanıcı bulunamadı veya hata oluştu.';
        this.filteredUsers = [];
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchName = '';
    this.filters = { id: '', isim: '', email: '', kayitTarihi: '' };
    this.filteredUsers = [...this.users];
  }

  refreshData(): void {
    this.search();
    this.countdown = 120;
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(u => {
      return (
        (!this.filters.id || u.id.toString().includes(this.filters.id)) &&
        (!this.filters.isim || u.isim.toLowerCase().includes(this.filters.isim.toLowerCase())) &&
        (!this.filters.email || u.email.toLowerCase().includes(this.filters.email.toLowerCase())) &&
        (!this.filters.kayitTarihi || new Date(u.kayitTarihi).toLocaleDateString().includes(this.filters.kayitTarihi))
      );
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      let aVal: any = a[column as keyof Kullanici];
      let bVal: any = b[column as keyof Kullanici];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.refreshData();
      }
    }, 1000);
  }

  // Modal işlemleri
  openCreateModal(): void {
    this.modalError = null;
    this.error = null;
    this.isEditMode = false;
    this.selectedKullanici = null;
    this.isModalOpen = true;
  }

  openEditModal(kullanici: Kullanici): void {
    this.modalError = null;
    this.error = null;
    this.isEditMode = true;
    this.selectedKullanici = kullanici;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedKullanici = null;
    this.isEditMode = false;
    this.modalError = null;
  }

  onFormSubmit(formData: FormData): void {
    this.isSaving = true;

    if (this.isEditMode && this.selectedKullanici) {
      // Update
      this.svc.updateKullanici(this.selectedKullanici.id, formData).subscribe({
        next: (res) => {
          if (res && (res as any).success === false) {
            this.error = (res as any).message || 'Kullanıcı güncellenemedi.';
          } else {
            this.error = null;
            this.updateUserInLocalLists(this.selectedKullanici!.id, formData);
            this.closeModal();
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Update error', err);
          this.error = err?.error?.message || err?.message || 'Güncelleme sırasında hata oluştu.';
          this.isSaving = false;
        }
      });
    } else {
      // Create
      this.svc.createKullanici(formData).subscribe({
        next: (res) => {
          if (res && (res as any).success === false) {
            this.error = (res as any).message || 'Kullanıcı eklenemedi.';
          } else {
            this.error = null;
            const newKullanici: Kullanici = {
              id: res.data,
              isim: formData.isim,
              email: formData.email,
              kayitTarihi: new Date().toISOString()
            };
            this.addUserToLocalLists(newKullanici);
            this.closeModal();
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Create error', err);
          this.error = err?.error?.message || err?.message || 'Ekleme sırasında hata oluştu.';
          this.isSaving = false;
        }
      });
    }
  }

  private addUserToLocalLists(user: Kullanici): void {
    this.users.push(user);
    if (this.shouldShowUser(user)) {
      this.filteredUsers.push(user);
    }
  }

  private updateUserInLocalLists(id: number, formData: FormData): void {
    const updateInList = (list: Kullanici[]) => {
      const index = list.findIndex(u => u.id === id);
      if (index >= 0) {
        list[index] = {
          ...list[index],
          isim: formData.isim,
          email: formData.email
        };
      }
    };

    updateInList(this.users);
    updateInList(this.filteredUsers);
  }

  private shouldShowUser(user: Kullanici): boolean {
    if (this.searchName && this.searchName.toString().trim()) {
      const id = Number(this.searchName);
      return Number.isInteger(id) && user.id === id;
    }

    return Object.entries(this.filters).every(([key, value]) => {
      if (!value) {
        return true;
      }

      const fieldValue = (user as any)[key];
      if (key === 'kayitTarihi') {
        return fieldValue ? new Date(fieldValue).toLocaleDateString().includes(value) : false;
      }

      return fieldValue?.toString().toLowerCase().includes(value.toLowerCase());
    });
  }
}
