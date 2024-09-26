import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

enum DeviceUrl {
    ALL = 'device/all'
}

@Injectable({providedIn: 'root'})
export class DeviceApiService {
    private readonly http: HttpClient = inject(HttpClient);

    public getWifiDeviceList(): Observable<void> {
        return this.http.get<void>(DeviceUrl.ALL);
    }
}
