import { CommonUtils } from './../../services/common-utils.service';
import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'menu-tree',
  templateUrl: './menu-tree.component.html',
  styles: []
})
export class MenuTreeComponent implements OnChanges {
  /** Parameter */
  nodes: [];
  @Input()
  public title: any;
  @Input()
  public dataSource: any;
  @Input()
  public isMainAction: boolean;

  @Output()
  public onChangeSelectedNodes: EventEmitter<any> = new EventEmitter<any>();
  formSearch: FormGroup;
  /** Constructor */
  constructor(private formBuilder: FormBuilder) {
    this.formSearch = this.formBuilder.group({keyword: ['']});
   }

  ngOnChanges() {
    if (!this.isMainAction) {
      this.nodes = this.buildTree(this.dataSource);
    } else {
      if (this.dataSource && this.dataSource.length > 0) {
        let mainFuncs = this.dataSource.filter(x => x.isMainAction === true) as any[];
        for (const func of mainFuncs) {
          this.addNodes(this.dataSource, mainFuncs, func);
        }
        mainFuncs = CommonUtils.sort(mainFuncs, 'sortOrder');
        this.nodes = this.buildTree(mainFuncs);
      }
    }
    console.log(this.nodes)
  }
  /** Methods */
  public onSearch(): void {
    const str = this.formSearch.get('keyword').value;
    this.nodes = [];
    const filteredData = this.dataSource.filter(x => x.label && x.label.toLowerCase().includes(str.toLowerCase()));
    if (filteredData) {
      if (!this.isMainAction) {
        let funcs = filteredData;
        for (const func of funcs) {
          this.addNodes(this.dataSource, funcs, func);
        }
        funcs = CommonUtils.sort(funcs, 'sortOrder');
        this.nodes = this.buildTree(funcs);
      } else {
        let mainFuncs = filteredData.filter(x => x.isMainAction === true) as any[];
        for (const func of mainFuncs) {
          this.addNodes(this.dataSource, mainFuncs, func);
        }
        mainFuncs = CommonUtils.sort(mainFuncs, 'sortOrder');
        this.nodes = this.buildTree(mainFuncs);
      }
    }
  }
  onSelectionChange($event) {
    this.onChangeSelectedNodes.emit($event);
  }
  /** Functions */
  private addNodes(dataSource: any, dataDest: any, node: any) {
    if (!this.isExist(dataDest, node.nodeId)) {
      dataDest.push(dataSource.filter(x => x.nodeId === node.nodeId)[0]);
    }
    this.getParent(dataSource, dataDest, node.parentId);
    return dataDest;
  }
  private getParent(arr, arrDest, parentId) {
    for (const i in arr) {
      if (arr[i].nodeId === parentId) {
        this.getParent(arr, arrDest, arr[i].parentId);
        if (!this.isExist(arrDest, arr[i].nodeId)) {
          arrDest.push(arr[i]);
        }
      }
    }
  }
  private isExist(arr, nodeId) {
    const item = arr.filter(x => x.nodeId === nodeId);
    if (item && item.length > 0) {
      return true;
    }
    return false;
  }
  private buildTree(data: any): any {
    const dataMap = data.reduce((m, d) => {
      m[d.nodeId] = Object.assign({}, d);
      return m;
    }, {});
    const listTemp = data.filter(d => {
      if (d.parentId !== null) { // assign child to its parent
        const parentNode = dataMap[d.parentId];
        if (parentNode['children'] === undefined || parentNode['children'] === null ) {
          parentNode['children'] = [];
        }
        parentNode.children.push(dataMap[d.nodeId]);
        parentNode.expanded = true;
        return false;
      }
      return true; // root node, do nothing
    }).map(d => dataMap[d.nodeId]);
    return listTemp;
  }
}
