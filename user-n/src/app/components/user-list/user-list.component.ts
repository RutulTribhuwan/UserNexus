import { Component, OnInit } from '@angular/core';
import { User } from '../../services/models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  usersPerPage: number = 10;
  totalPages: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = [...data]; // ✅ Create a new copy
      this.filteredUsers = [...data]; // ✅ Ensure filtering does not affect original data
      this.currentPage = 1; // ✅ Always start from first page
      this.calculateTotalPages();
      this.updatePagination();
    });
  }

  onSearch(): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1; // ✅ Reset to first page after search
    this.calculateTotalPages();
    this.updatePagination();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
    console.log("🔹 Total Users:", this.filteredUsers.length);
    console.log("🔹 Users Per Page:", this.usersPerPage);
    console.log("🔹 Total Pages:", this.totalPages);
  }

  updatePagination(): void {
    this.calculateTotalPages(); // ✅ Ensure pages are calculated before slicing data
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);

    console.log("🔹 Current Page:", this.currentPage);
    console.log("🔹 Start Index:", startIndex);
    console.log("🔹 End Index:", endIndex);
    console.log("🔹 Paginated Users:", this.paginatedUsers);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
      this.filteredUsers = [...this.users]; // ✅ Ensure `filteredUsers` is updated
      this.currentPage = 1; // ✅ Reset to first page after deletion
      this.calculateTotalPages();
      this.updatePagination();
    });
  }
}
