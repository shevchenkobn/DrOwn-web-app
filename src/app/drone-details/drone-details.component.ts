import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DroneStatus, IDrone } from '../_models/drone.model';
import { DronesService } from '../_services/drones.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-drone-details',
  templateUrl: './drone-details.component.html',
  styleUrls: ['./drone-details.component.scss']
})
export class DroneDetailsComponent implements OnInit {
  protected _route: ActivatedRoute;
  protected _drones: DronesService;

  public isMakingRequest!: boolean;
  public drone!: Readonly<IDrone>;
  public droneStatus = DroneStatus;

  constructor(route: ActivatedRoute, dronesService: DronesService) {
    this._route = route;
    this._drones = dronesService;
  }

  canBeChanged() {
    return this.drone.status === DroneStatus.OFFLINE || this.drone.status === DroneStatus.UNAUTHORIZED;
  }

  refreshDrone() {
    this.isMakingRequest = true;
    this._drones.getDrone(this.drone.droneId).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      })
    ).subscribe(drone => {
      this.drone = drone;
    });
  }

  ngOnInit() {
    this.isMakingRequest = false;
    console.log(this._route);
    this.drone = this._route.snapshot.data['drone'];
  }

}
