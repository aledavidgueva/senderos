import { InjectionToken } from '@angular/core';
import MapLib from 'leaflet';
import { IObservable } from '../Utils/IObservable';
import { GraphScreen, PathPlannerModel } from '../Models/PathPlannerModel';
import { IObserver } from '../Utils/IObserver';
import { Location } from '../Utils/Location';
import { Config } from '../Utils/Config';
import { Result } from '../Utils/Result';

export const PATH_PLANNER_CONTROLLER =
  new InjectionToken<PathPlannerController>('PathPlannerController');

export class PathPlannerController implements IObservable {
  private pathPlannerModel: PathPlannerModel;

  public constructor(pathPlannerModel: PathPlannerModel) {
    this.pathPlannerModel = pathPlannerModel;
  }

  public getMapTileLayerUrlTemplate(): string {
    return this.pathPlannerModel.getConfig().getMapTileLayerUrlTemplate();
  }

  public getMapInitialLatLng(): MapLib.LatLngExpression {
    return this.pathPlannerModel.getConfig().getMapInitialLatLng();
  }

  public getMapHeight(): string {
    return `${this.pathPlannerModel.getConfig().getMapHeight()}px`;
  }

  public getLocations(): Array<Location> {
    return this.pathPlannerModel.getLocations();
  }

  public getMatrix(): Array<Array<number>> {
    return this.pathPlannerModel.getMatrix();
  }

  public getPrimResult(): Result | null {
    return this.pathPlannerModel.getPrimResult();
  }

  public getKruskalResult(): Result | null {
    return this.pathPlannerModel.getKruskalResult();
  }

  public locationExists(lat: number, lng: number): boolean {
    return this.pathPlannerModel.locationExists(
      new Location('Test', new MapLib.LatLng(lat, lng)),
    );
  }

  public getColorOfWeight(weight: number): 'red' | 'green' | 'yellow' {
    if (weight >= 0.7 * Config.maxPathWeight) return 'red';
    if (weight >= 0.45 * Config.maxPathWeight) return 'yellow';
    return 'green';
  }

  public addLocation(
    name: string,
    lat: number,
    lng: number,
    adjacency: Array<number | null>,
  ): void {
    this.pathPlannerModel.addLocation(
      new Location(name, new MapLib.LatLng(lat, lng)),
      adjacency,
    );
  }

  public setScreen(screen: GraphScreen): void {
    this.pathPlannerModel.setScreen(screen);
  }

  public getScreen(): GraphScreen {
    return this.pathPlannerModel.getScreen();
  }

  public resolveWithPrim(): void {
    this.pathPlannerModel.resolveWithPrim();
  }

  public resolveWithKruskal(): void {
    this.pathPlannerModel.resolveWithKruskal();
  }

  public importData(data: string): void {
    this.pathPlannerModel.import(data);
  }

  public exportData(): string {
    return this.pathPlannerModel.export();
  }

  public async generateRandom(count: number): Promise<void> {
    // rango de coordenadas aprox. dentro de argentina
    const argLatMin = -37.53;
    const argLatMax = -27.94;
    const argLngMin = -68.74;
    const argLngMax = -58.48;

    for (let i = 0; i < count; i++) {
      const rndLat: number = Number(
        (Math.random() * (argLatMax - argLatMin) + argLatMin).toFixed(8),
      );
      const rndLng: number = Number(
        (Math.random() * (argLngMax - argLngMin) + argLngMin).toFixed(8),
      );

      const rndAdjacency: Array<number | null> = new Array();
      const locations: number = this.getLocations().length;
      for (let j = 0; j < locations; j++) {
        rndAdjacency.push(
          Math.random() > 0.7
            ? Math.floor(Math.random() * Config.maxPathWeight) + 1
            : null,
        );
      }
      // Aseguro que al menos esté conectado a otro
      if (locations > 0) {
        rndAdjacency[Math.floor(Math.random() * locations)] =
          Math.floor(Math.random() * Config.maxPathWeight) + 1;
      }

      this.addLocation(`Random ${i}`, rndLat, rndLng, rndAdjacency);
      await this.sleep(300);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  public addObserver(observer: IObserver): void {
    this.pathPlannerModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.pathPlannerModel.removeObserver(observer);
  }
}
