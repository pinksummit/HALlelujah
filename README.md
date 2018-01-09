# Hallelujah

Hallelujah! This Angular module offers a [HAL/JSON](http://stateless.co/hal_specification.html) http-client to easily interact with a [Spring Data Rest](https://projects.spring.io/spring-data-rest) API (and by extend any API that conforms the Spring Data Rest resource model)

!! This module needs Angular version 4.3+ since it uses the new HttpClientModule introduced in 4.3

Happy coding! Feedback much appreciated!

##### Disclaimer: This project is work in progress

## Installation
```
npm install ng2-hallelujah
```
## Configuration

1. Import HallelujahModule in your app root module
2. ResourceService is the entry-point for interacting with Spring Data Rest resources. Their should be only one application-wide ResourceService. So we add it to the providers of our app root module.
3. Set the base URL of our Spring Data Rest API with the API_URI InjectionToken. Either put a string value or use an environment variable (best practise in multi-environment deployments)

```typescript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HallelujahModule, ResourceService, API_URI} from 'ng2-hallelujah';

import {AppComponent} from './app.component';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HallelujahModule
  ],
  providers: [
    ResourceService,
    { provide: API_URI, useValue: environment.api_url }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

## Usage
First of all let's model our resource entities.  
To illustrate we use a simple model of a team and players  
Notice that our entity class extends the Resource class.  
By inheriting the Resource class we give HAL specific features to our entity 

**Attention**: The name and type of the members of your resource class must exactly match the name and type of the members of the resource entity exposed by your API  

```typescript
import {Resource} from 'ng2-hallelujah';

export class Player extends Resource{
    firstName: string;
    lastName: string;   
}
```
Since a Team consists of multiple players, we model the one-to-many relationship between the Team resource and the Player resources
```typescript
import {Resource} from 'ng2-hallelujah';

export class Team extends Resource {
    name: string;
    players: Player[];
}
```
So far so good, time to make our application interact with the API.  
To illustrate we create a TeamManagerComponent that will implement some basic CRUD on our resources.

```typescript
import {ResourceService} from 'ng2-hallelujah';

@Component({...})
export class TeamManagerComponent implements OnInit {

  teams: Team[];
    
  constructor( private rs: ResourceService ) { }
  

  ngOnInit() {
    this.rs.getAll(Team, 'teams')
      .subscribe(teams => this.teams = teams);
  }
 }
```
Our component constructor has an argument of type ResourceService. Upon creation of the component the ResourceService instance we defined earlier as a provider in our root module will be injected and be available for further use in the component.  

To fetch these teams we use the getAll method of the ResourceService. This method requires 2 parameters:  
+ The type of the resource  
  i.e. Team
+ The relative URI path of the resource  
  i.e. 'teams' for 'http://localhost:8080/teams'


Every Team instance has hypermedia capabilities. i.e. To get all players of a team, you can simply do the following:

```typescript
let myTeam = this.teams[0];
myTeam.getAll(Player, 'players')
  .subscribe(players => myTeam.players = players);
```
Parameters:
+ The type of the resource  
  i.e. Player
+ The name of the relation. The value must match a member of the _links object in the HAL response of the owning resource  
  i.e. 'players'  

See the API section of this documentation for all capabilities and options.

HAllelujah!  

## Authentication

This library uses Angular's HTTPClient module under the hood. Just implement your own authentication HttpInterceptor and wire it in your application using the HTTP_INTERCEPTORS Injectiontoken.  
https://angular.io/guide/http#intercepting-all-requests-or-responses


## API
### ResourceService

```getAll<R extends Resource>(type: { new(): R }, resource: string, options?: { size?: number, sort?: Sort[], params?: [{ key: string, value: string | number }] }): Observable<R[]>```

The method to get all resources of the specified resource type

returns

Observable<R[]>

params

type
resource
options
  
```get <R extends Resource>(type: { new(): R }, resource: string, id: any): Observable<R>```

```search<R extends Resource>(type: { new(): R }, query: string, options?: { size?: number, sort?: Sort[], params?: [{ key: string, value: string | number }] }): Observable<R[]>```

```create<R extends Resource>(entity: R): Observable<any>```

```delete<R extends Resource>(resource: R): Observable<any>```

### Resource

```getAll<R extends Resource>(type: { new(): R }, relation: string, options?: { size?: number, sort?: Sort[], params?: [{ key: string, value: string | number }] }): Observable<R[]>```

```get <R extends Resource>(type: { new(): R }, relation: string): Observable<R>```

```bind<R extends Resource>(resource: R): Observable<any>```

```unbind(relation: string): Observable<any>```

```add<R extends Resource>(relation: string, resource: R): Observable<any>```
 
## Demo Application
TODO

## Roadmap

+ Add support for projections
