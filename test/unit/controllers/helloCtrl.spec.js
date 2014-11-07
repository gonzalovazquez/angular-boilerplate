describe('helloCtrl', function() {
	var scope, controller;

	beforeEach(module('angular-template'));

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		controller = $controller('helloCtrl', {$scope: scope});

		scope.name = "Gonzalo";
		scope.$apply();
	}));

	it('should print the name', function() {
		expect(scope.name).toBe("Gonzalo");
	});
});