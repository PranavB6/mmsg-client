import {
  CanActivate,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { SocketioService } from './socketio.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private socketService: SocketioService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true;
  }
}
