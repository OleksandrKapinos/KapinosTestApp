import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList: any = [];
  isLoading: boolean;
  isEmptyContainer: boolean;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers().pipe(first()).subscribe(
      users => {
        this.usersList = users.map(user => {
          const {username, website, company, ...rest} = user;
          return {...rest};
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.isEmptyContainer = true;
      }
    );
  }

  goToPosts(id) {
    this.router.navigate(['/posts'], { queryParams: { userId: id } });
  }
}
