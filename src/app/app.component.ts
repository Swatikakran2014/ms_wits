import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorkItems } from './model/work.item';
import { BackendApiService } from './services/backend-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  workItemIds: [];
  workItemNodes: WorkItems[];
  workItems:WorkItems ={id:"0",child:[]};
 
  elemHierarchy: string = '';
  @ViewChild("one", { static: false }) d1: ElementRef;
  //@ViewChild('one') d1:ElementRef;

ngAfterViewInit() {
  setTimeout(()=>{
    this.d1.nativeElement.insertAdjacentHTML('beforeend', this.elemHierarchy);
  },1000);
  
}
  
  constructor(private backendapi: BackendApiService) {}

  

  ngOnInit(): void {
    let ids = '';
    this.backendapi.getWorkItems().subscribe((data) => {
      this.workItemIds = data.values.map((value) => value.id);
      this.workItemIds.forEach(
        (wi) => (ids = ids !== '' ? ids + ',' + wi : ids + wi)
      );
      this.backendapi
        .getWIRelations(ids)
        .subscribe((data) => {
          //Preparing all the nodes from the data
          this.workItemNodes = data.value.map(val => this.formWorkItem(val));
          console.log(JSON.stringify(this.workItemNodes) + " workItemNodes ");
          //Preparing all the parent nodes
          this.workItemNodes.forEach((node, index)=> {
            if(!node.parent)
            {
              this.workItems.child.push(node);
              this.workItemNodes.splice(index, 1);
            } 
          });
          //Adding child nodes
          while(this.workItemNodes.length > 0){
            this.resetVisited(this.workItems);
            this.workItemNodes.forEach((node, index) =>{
              this.findParentNode(this.workItems,node);
              node.assigned && this.workItemNodes.splice(index, 1);
            });
          }
          this.resetVisited(this.workItems);
          this.prepareView(this.workItems);
          console.log(this.workItems);
          console.log(this.elemHierarchy);
        
        });
    });
  }

  findParentNode(node:WorkItems, assigneeNode: WorkItems)
    {
        node.visited = true;
        if(node.id === assigneeNode.parent) {
          node.child.push(assigneeNode);
          assigneeNode.assigned = true;
        } 
        for(let child of node.child)
        {
            if (!child.visited)
                 this.findParentNode(child, assigneeNode);
        }
        
    }

    resetVisited(node:WorkItems){
      node.visited = false;
      for(let child of node.child)
        {
            if (child.visited)
                 this.resetVisited(child);
        }
    }

    prepareView(node:WorkItems){
      node.visited = true;
      this.elemHierarchy = this.elemHierarchy + '<ul>';
      for(let child of node.child)
        {
          this.elemHierarchy = this.elemHierarchy + '<li>' + child.id + '      '+ child.title + '</li>';
            if (!child.visited)
                 this.prepareView(child);
        }
        this.elemHierarchy = this.elemHierarchy + '</ul>';
    }
  
  private formWorkItem(node: any): WorkItems {
    let wi: WorkItems = {};
    wi.id = node.id;
    wi.title = node.fields['System.Title'];
    wi.parent = node.fields['System.Parent'];
    wi.child = [];
    wi.visited = false;
    wi.assigned = false;
    return wi;
  }
}
