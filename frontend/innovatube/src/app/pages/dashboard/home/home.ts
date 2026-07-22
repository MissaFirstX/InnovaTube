import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Favorites } from '../favorites/favorites';
import { Videos } from '../videos/videos';

@Component({
  selector: 'app-home',
  imports: [Navbar, CommonModule, Favorites, Videos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
