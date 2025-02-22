import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  userForm: FormGroup;
  userId: number | null = null;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void{
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe(user => {
        this.userForm.patchValue(user);
      });
    }
  }
  
  submitForm(): void{
    if (this.userForm.valid) {
      const user: User = { id: this.userId && this.userId > 0 ? this.userId : Date.now(), ...this.userForm.value };
    
      if (this.userId) {
        this.userService.updateUser(user).subscribe(() => {
          this.router.navigate(['/'])
        });
      }
      else {
        this.userService.addUser(user).subscribe(() => {
          this.router.navigate(['/']);
        })
      }
    
    }
   
  }


}
