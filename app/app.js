'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ui.bootstrap']);




app.controller('SceneBuilderController', function SceneBuilderController($scope, $http, $filter, $q) {

  var ITEMS_URL = 'http://192.168.0.101:8080/rest/items';
  var RULES_URL = 'http://192.168.0.101:8080/rest/rules';
  

  var refresh = function(){

    $http.get(ITEMS_URL).then(function(resp){
    console.log(resp.data);
    $scope.items=$filter('filter')(resp.data,function(item){
      return(item.type=="Switch" | item.type=="Dimmer" | item.type=="Color");
    });    
  });

  }

  var createItemObject = function(sceneName){
    let itemName = "SC_" + sceneName + "_SW";
    let itemData = {
      name : itemName,
      type : "Switch",
      label : "Scene " + sceneName
    };
    return itemData;
  }

  var createRule = function(items, sceneName){
    console.log(items);
    let rule = {
      tags:[],
      conditions:[],
      description: "Rule to trigger Scene: " + sceneName,
      name: "SC_"+ sceneName + "_RL",
      triggers: [],
      actions: []
    }
    let idCounter = 1;
    let trigger = {
      id: idCounter,
      label: "Scene trigger",
      description: "Triggers Scene " + sceneName,
      type: "core.ItemStateChangeTrigger",
      configuration: {itemName:"SC_" + sceneName + "_SW", state:"ON"}    
    };
    rule.triggers.push(trigger);

    angular.forEach(items, function(obj, idx){
      idCounter++;
      let action = {
        id:idCounter,
        label: "send Command",
        type: "core.ItemCommandAction",
        configuration: {itemName:obj.name, command: obj.state}
      }
      rule.actions.push(action);
    });
    idCounter++;
    rule.actions.push({
        id:idCounter,
        label: "send Command",
        type: "core.ItemCommandAction",
        configuration: {itemName:"SC_" + sceneName + "_SW", command:"OFF"}
      });

    return rule;
  }

  var sendRequest = function(switchItem, rule){
    let url = ITEMS_URL+'/'+switchItem.name;
    $http.put(url,switchItem).then(function(resp){
      console.log(resp.status);
      let rule_url = RULES_URL;
      $http.post(rule_url, rule).then(function(resp){
        console.log(resp.status);
        $scope.respCode = resp.status;
      },function(resp){
        console.log(resp.status);
        $scope.respCode = resp.status;
      });

    },function(resp){
      console.log(resp.status);
      $scope.respCode = resp.status;
    });



  }

  var getItemStates = function(items){
    let itemStates = [];
    let promises = [];

    angular.forEach(items, function(item){
      let url = ITEMS_URL+'/'+item.name;
      promises.push($http.get(url));
    });
    return $q.all(promises);

    
  }

  $scope.refreshItems = function(){
    refresh();

  }



  $scope.onClick = function(){
    console.log("called");
    let selectedItems = $filter('filter')($scope.items,{selected: true});
    
    let promise = getItemStates(selectedItems);
    promise.then(function(responses){
      let itemStates = []; 
      angular.forEach(responses, function(resp){
        console.log(resp);
        itemStates.push(resp.data);
      });
      let switchItem = createItemObject($scope.sceneName);
      let rule = createRule(itemStates, $scope.sceneName);      

      $scope.reqdata = rule;

      sendRequest(switchItem, rule);

    });  



    
    
  }  

  refresh(); 

  });

 


