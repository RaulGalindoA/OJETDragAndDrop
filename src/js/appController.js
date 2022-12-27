/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define([
  "ojs/ojcontext",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "knockout",
  "require",
  "exports",
  "ojs/ojbootstrap",
  "./dataVisualizations/layouts/DemoGridLayout",
  "text!./dataVisualizations/resources/dndDataSample.json",
  "ojs/ojarraydataprovider",
  "ojs/ojattributegrouphandler",
  "ojs/ojdiagram-utils",
  "ojs/ojknockout",
  "ojs/ojdiagram",
], function (
  Context,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ko,
  require,
  exports,
  ojbootstrap_1,
  layout,
  jsonData,
  ArrayDataProvider,
  ojattributegrouphandler_1,
  ojdiagram_utils_1
) {
  function ControllerViewModel() {
    
    // Media queries for repsonsive layouts
    const smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

    // Header
    // Application Name used in Branding Area
    this.appName = ko.observable("App Name");
    // User Info used in Global Navigation area
    this.userLogin = ko.observable("john.hancock@oracle.com");

    console.log(layout)

    // Aqui va mi codigo

    this.dndData = {
      nodesA: [
        {
          id: "A0",
          label: "A0",
          category: "0",
        },
        {
          id: "A1",
          label: "A1",
          category: "1",
        },
        {
          id: "A2",
          label: "A2",
          category: "2",
        },
        {
          id: "A3",
          label: "A3",
          category: "0",
        },
        {
          id: "A4",
          label: "A4",
          category: "1",
        },
        {
          id: "A5",
          label: "A5",
          category: "2",
        },
        {
          id: "A6",
          label: "A6",
          category: "0",
        },
        {
          id: "A7",
          label: "A7",
          category: "1",
        },
        {
          id: "A8",
          label: "A8",
          category: "2",
        },
        {
          id: "A9",
          label: "A9",
          category: "0",
        },
        {
          id: "A10",
          label: "A10",
          category: "1",
        },
        {
          id: "A11",
          label: "A11",
          category: "2",
        },
      ],
      nodesB: [
        {
          id: "B0",
          category: "0",
          x: 15,
          y: 15,
        },
        {
          id: "B1",
          category: "1",
          x: 85,
          y: 85,
        },
        {
          id: "B2",
          category: "2",
          x: 155,
          y: 155,
        },

        {
          id: "B3",
          category: "3",
          x: 200,
          y: 200,
        }
      ],
      linksB: [
        {
          id: "L0",
          startNode: "B0",
          endNode: "B1",
        },
        {
          id: "L1",
          startNode: "B1",
          endNode: "B2",
        },
      ],
    };

    this.colorHandler = new ojattributegrouphandler_1.ColorAttributeGroupHandler();
    this.nodes1 = ko.observableArray(this.dndData.nodesA);
    this.nodes2 = ko.observableArray(this.dndData.nodesB);
    this.links2 = ko.observableArray(this.dndData.linksB);
    this.nodeDataProvider1 = new ArrayDataProvider(this.nodes1, {
      keyAttributes: "id",
    });
    this.nodeDataProvider2 = new ArrayDataProvider(this.nodes2, {
      keyAttributes: "id",
    });
    this.linkDataProvider2 = new ArrayDataProvider(this.links2, {
      keyAttributes: "id",
    });
    this.panZoomState = ko.observable({
      zoom: 0,
      centerX: null,
      centerY: null,
    });
    this.onDrop = (event, context, nodes, linkCleanUp) => {
      const diagramData =
        event.dataTransfer.getData("text/nodes1") ||
        event.dataTransfer.getData("text/nodes2");
      let newNodeId;
      // create new node
      if (diagramData) {
        const dataContext = JSON.parse(diagramData)[0];
        //remove specific node from from it's current location
        this.nodes1.remove((s) => {
          return s.id === dataContext.id;
        });
        this.nodes2.remove((s) => {
          return s.id === dataContext.id;
        });
        if (linkCleanUp)
          this.links2.remove((s) => {
            return s.start === dataContext.id || s.endNode === dataContext.id;
          });
        //add node to the target
        dataContext.itemData.x = context.nodeContext
          ? context.x + 100
          : context.x;
        dataContext.itemData.y = context.y;
        newNodeId = dataContext.itemData.id;
        nodes.push(dataContext.itemData);
      }
      if (context.nodeContext) {
        const startNodeId = context.nodeContext.id;
        this.links2.push({
          id: "L" + startNodeId + "_" + newNodeId,
          startNode: startNodeId,
          endNode: newNodeId,
        });
      } else if (context.linkContext) {
        const linkId = context.linkContext.id,
          startNode = context.linkContext.data.startNode,
          endNode = context.linkContext.data.endNode;
        this.links2.remove((s) => {
          return s.id === linkId;
        });
        this.links2.push({
          id: "L" + startNode + "_" + newNodeId,
          startNode: startNode,
          endNode: newNodeId,
        });
        this.links2.push({
          id: "L" + newNodeId + "_" + endNode,
          startNode: newNodeId,
          endNode: endNode,
        });
      }
    };
    this.labelLayoutFunc = (layoutContext, node) => {
      const nodeBounds = node["getContentBounds"]();
      const nodePos = node["getPosition"]();
      const labelLayout = {
        // Codigo original
        // x: nodeBounds.x + nodePos.x + 0.5 * nodeBounds.w,
        // y: nodeBounds.y + nodePos.y + 0.5 * nodeBounds.h,

        // Movimiento para la etiqueta debajo
        x: nodeBounds.x + nodePos.x + .5 * nodeBounds.w,
        y: nodeBounds.y + nodePos.y + 1.2 * nodeBounds.h,
        halign: "center",
        valign: "middle",
      };
      return labelLayout;
    };
    this.linkPathFunc = (layoutContext, link) => {
      const node1 = layoutContext.getNodeById(link["getStartId"]());
      const node2 = layoutContext.getNodeById(link["getEndId"]());
      const n1Pos = node1.getPosition(),
        n2Pos = node2.getPosition();
      const n1Bounds = node1.getBounds(),
        n2Bounds = node2.getBounds();
      const startX = n1Pos.x + 0.5 * n1Bounds.w;
      const startY = n1Pos.y + 0.5 * n1Bounds.h;
      const endX = n2Pos.x + 0.5 * n2Bounds.w;
      const endY = n2Pos.y + 0.5 * n2Bounds.h;
      return [startX, startY, endX, endY].toString();
    };
    this.onDrop1 = (event, context) => {
      this.onDrop(event, context, this.nodes1, true);
    };
    this.onDrop2 = (event, context) => {
      this.onDrop(event, context, this.nodes2, false);
    };
    this.onLinkDrop = (event, context) => {
      this.onDrop(event, context, this.nodes2, false);
    };
    this.gridLayout = layout.gridLayout();
    this.dropLayout = ko.pureComputed(
      function () {
        return (0, ojdiagram_utils_1.getLayout)({
          nodes: this.nodes2(),
          links: this.links2(),
          nodeDefaults: { labelLayout: this.labelLayoutFunc },
          linkDefaults: { path: this.linkPathFunc },
          panZoomState: this.panZoomState.peek(),
        });
      }.bind(this)
    );
    this.selectedNodesValue = ko.observableArray([]);
    this.selectionValue = ko.observable('single');
    this.selectionText = ko.pureComputed(() => {
      const items = this.selectedNodesValue().join(', ');
      return items;
  });
    this.buttonAction = ()=> {
      console.log("this");
    };

    // Aqui termina mi codigo
  }

  // release the application bootstrap busy state
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();

  return new ControllerViewModel();
});
