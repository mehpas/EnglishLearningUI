import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnglishLearningService, Kullanici } from '../services/english-learning.service';

@Component({
  selector: 'app-english-learning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './english-learning.component.html',
  styleUrls: ['./english-learning.component.scss']
})
export class EnglishLearningComponent implements OnInit, OnDestroy {
  users: Kullanici[] = [];
  filteredUsers: Kullanici[] = [];
  loading = false;
  error: string | null = null;
  
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
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
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
          this.filteredUsers = res.data || [];
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
    this.filteredUsers = this.users;
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
}
