import {Injectable, EventEmitter} from '@angular/core';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import commons from '../common';
import {Platform} from '@ionic/angular';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class DiagnosticService {

    /*********************
     * Internal properties
     *********************/
    
    private stateCheckCount: number;
    private stateChanged: boolean;
    private stateChecking: boolean;

    private checkTimer;


    /********************
     * Public properties
     ********************/

    public static instance: DiagnosticService;

    public locationAvailable: boolean;
    public locationEnabled: boolean;
    public locationAuthorized: boolean;
    public locationAuthorizationStatus: string;
    public wifiEnabled: boolean;
    public wifiAvailable: boolean;
    public gpsLocationAvailable: boolean;
    public networkLocationAvailable: boolean;
    public gpsLocationEnabled: boolean;
    public networkLocationEnabled: boolean;
    public locationMode: string;

    /********************
     * Internal functions
     ********************/
    private resetStateCheckCount(){
        let $this = DiagnosticService.instance;
        $this.stateCheckCount = 0;
        $this.stateChanged = false;
        $this.stateChecking = true;
    }
    
    private beginStateCheckFn(){
        let $this = DiagnosticService.instance;
        $this.stateCheckCount++;
    }

    private endStateCheckFn(){
        let $this = DiagnosticService.instance;
        $this.stateCheckCount--;
        if($this.stateCheckCount === 0){
            $this.stateChecking = false;
            if($this.stateChanged){
                $this.events.emit('diagnostic:stateupdated');
            }
        }
    }
    
    private onStateCheckError(error){
        let $this = DiagnosticService.instance;
        $this.endStateCheckFn();
        console.error(error);
    }
    

    /**********************
     * Public API functions
     **********************/
    constructor(private diagnostic: Diagnostic,
                private platform: Platform,
                private events: EventEmitter<any>) {

        let supportedPlatforms:string[] = ['android', 'ios', 'windows'];
        if (!supportedPlatforms.includes(commons.platform)) {
            // skip setting up diagnostic services in unsupported platforms
            return;
        };

        DiagnosticService.instance = this;

        platform.ready().then(() => {
            // Initial check and poll every 1s
            this.checkTimer = Observable.timer(0, 1000);
            this.checkTimer.subscribe(this.checkState);

            // Add state change listeners
            if (commons.platform === "android" || commons.platform === "ios") {
                this.diagnostic.registerBluetoothStateChangeHandler((state) => {
                    console.info("Bluetooth state changed to: " + state);
                    this.checkState();
                });
                this.diagnostic.registerLocationStateChangeHandler((state) => {
                    console.info("Location state changed to: " + state);
                    this.checkState();
                });
            }

            if (commons.platform === "android"){
                this.diagnostic.registerPermissionRequestCompleteHandler((statuses) => {
                    let msg = "Permission request complete: ";
                    for (var permission in statuses){
                        switch(statuses[permission]){
                            case this.diagnostic.permissionStatus.GRANTED:
                                msg += "permission granted to use "+permission;
                                break;
                            case this.diagnostic.permissionStatus.NOT_REQUESTED:
                                msg += "permission to use "+permission+" has not been requested yet";
                                break;
                            case this.diagnostic.permissionStatus.DENIED:
                                msg += "permission denied to use "+permission;
                                break;
                            case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                                msg += "permission permanently denied to use "+permission;
                                break;
                        }
                    }
                    console.info(msg);
                });
            }
        });

        this.platform.resume.subscribe(this.checkState);
    }

    public checkState() {
        let $this = DiagnosticService.instance;

        if($this.stateChecking){
            return;
        }
        
        $this.resetStateCheckCount();
        
        // All platforms
        $this.beginStateCheckFn();
        $this.diagnostic.isLocationAvailable().then((available) => {
            if($this.locationAvailable !== available){
                $this.stateChanged = true;
            }
            $this.locationAvailable = available;
            $this.endStateCheckFn();
        }, $this.onStateCheckError).catch($this.onStateCheckError);

        $this.beginStateCheckFn();
        $this.diagnostic.isWifiAvailable().then((available) => {
            if($this.wifiAvailable !== available){
                $this.stateChanged = true;
            }
            $this.wifiAvailable = available;
            $this.endStateCheckFn();
        }, $this.onStateCheckError).catch($this.onStateCheckError);

        $this.beginStateCheckFn();
        $this.diagnostic.isWifiEnabled().then((enabled) => {
            if($this.wifiEnabled !== enabled){
                $this.stateChanged = true;
            }
            $this.wifiEnabled = enabled;
            $this.endStateCheckFn();
        }, $this.onStateCheckError).catch($this.onStateCheckError);

        // Android & iOS
        if (commons.platform === "android" || commons.platform === "ios") {
            $this.beginStateCheckFn();
            $this.diagnostic.isLocationEnabled().then((enabled) => {
                if($this.locationEnabled !== enabled){
                    $this.stateChanged = true;
                }
                $this.locationEnabled = enabled;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.isLocationAuthorized().then((authorized) => {
                if($this.locationAuthorized !== authorized){
                    $this.stateChanged = true;
                }
                $this.locationAuthorized = authorized;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.getLocationAuthorizationStatus().then((status) => {
                if($this.locationAuthorizationStatus !== status){
                    $this.stateChanged = true;
                }
                $this.locationAuthorizationStatus = status;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);
        }

        // Android only
        if (commons.platform === "android") {
            $this.beginStateCheckFn();
            $this.diagnostic.isGpsLocationAvailable().then((available) => {
                if($this.gpsLocationAvailable !== available){
                    $this.stateChanged = true;
                }
                $this.gpsLocationAvailable = available;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.isNetworkLocationAvailable().then((available) => {
                if($this.networkLocationAvailable !== available){
                    $this.stateChanged = true;
                }
                $this.networkLocationAvailable = available;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.isGpsLocationEnabled().then((enabled) => {
                if($this.gpsLocationEnabled !== enabled){
                    $this.stateChanged = true;
                }
                $this.gpsLocationEnabled = enabled;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.isNetworkLocationEnabled().then((enabled) => {
                if($this.networkLocationEnabled !== enabled){
                    $this.stateChanged = true;
                }
                $this.networkLocationEnabled = enabled;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

            $this.beginStateCheckFn();
            $this.diagnostic.getLocationMode().then((mode) => {
                if($this.locationMode !== mode){
                    $this.stateChanged = true;
                }
                $this.locationMode = mode;
                $this.endStateCheckFn();
            }, $this.onStateCheckError).catch($this.onStateCheckError);

        }

        if(commons.platform === "ios"){
        }
    }

    // Location helpers
    public isLocationAvailable(){
        return this.locationAvailable;
    }

    public canRequestLocationAuthorization(){
        return this.locationAuthorizationStatus === this.diagnostic.permissionStatus.NOT_REQUESTED
            || this.locationAuthorizationStatus === this.diagnostic.permissionStatus.DENIED;
    }

    public requestLocationAuthorization(mode: string){
        this.diagnostic.requestLocationAuthorization(mode).then((status) => {
            console.log("Successfully requested location authorization: authorization was " + status);
            this.checkState();
        }, console.error).catch(console.error);
    }
}
