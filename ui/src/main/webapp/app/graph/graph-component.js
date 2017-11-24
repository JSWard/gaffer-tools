/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('app').component('graphView', graphView());

function graphView() {

    return {
        templateUrl: 'app/graph/graph.html',
        controller: GraphController,
        controllerAs: 'ctrl'
    };
}


function GraphController($scope, graph, results, $timeout, types, schema, events) {

    var vm = this;

    vm.selectedEdges = graph.getSelectedEdges();
    vm.selectedEntities = graph.getSelectedEntities();
    vm.schema;

    var promise = null;

    schema.get().then(function(schema) {
        vm.schema = schema;
    });

    events.subscribe('selectedElementsUpdate', function(selectedElements) {
        vm.selectedEdges = selectedElements.edges;
        vm.selectedEntities = selectedElements.entities;

        if(!promise) {
            promise = $timeout(function() {
                $scope.$apply();
                promise = null;
            })
        }
    });
  
    $timeout(function(evt) {
        graph.load().then(function(cy) {
            graph.reload();
        })
    });

    vm.resolve = function(value) {
        return types.getShortValue(value);
    }

    vm.resolveVertex = function(value) {
        return types.getShortValue(JSON.parse(value));
    }

}