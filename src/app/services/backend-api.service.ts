import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private httpClient:HttpClient) { }
  
  private  headers = {headers: new HttpHeaders().set('Authorization', 'Basic OnVvaDdtdmMzNmF6bDNmdXUzdnlpNzUzY25zdHdmN3k1NmpqZWRqZHFrc3V0Z2xuZnRmemE=')};

  getWorkItems(){
    return this.httpClient.
    get<any>("https://dev.azure.com/swatikakran2014/wits/_apis/wit/reporting/workitemrevisions?includeLatestOnly=true&api-version=6.0", this.headers);
  }

  getWIRelations(ids){
    return this.httpClient.
    get<any>("https://dev.azure.com/swatikakran2014/wits/_apis/wit/workitems?ids="+ids+"&api-version=6.0&$expand=Relations", this.headers);
  }

}
