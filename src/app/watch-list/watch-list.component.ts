import { Component, Input, OnInit } from '@angular/core';
import { Properties } from '../Interfaces/properties';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css'],
})
export class WatchListComponent implements OnInit {
  @Input()
  watchList: Properties[];

  constructor() {
    if (localStorage.getItem('RafiaHomesWatchList') !== null) {
      this.watchList = JSON.parse(localStorage.getItem('RafiaHomesWatchList'));
    }
  }

  ngOnInit(): void {}

  public removeFromWatchList(id): void {
    const indexNum = this.watchList.findIndex((item) => {
      return item.property_id === id;
    });
    this.watchList.splice(indexNum, 1);
    localStorage.setItem('RafiaHomesWatchList', JSON.stringify(this.watchList));
  }
}
