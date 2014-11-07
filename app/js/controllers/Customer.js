'use strict';

function CustomerCtrl($scope, syncData) {
	syncData('syncedValue').$bind($scope, 'syncedValue');
}