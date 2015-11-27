(function() {
	'use strict';

	angular
		.module(
			'starter', [
				'controllers',
				'ionic',
				'nmn',
			]
		)
		.config(config)
		.run(run)

	;

	function config(
		$stateProvider,
		$urlRouterProvider
	) {
		$stateProvider
			.state('test', {
				controller: 'Test as vm',
				templateUrl: 'templates/test.html',
				url: '/test',
			})

		;

		$urlRouterProvider.otherwise('/test');
	}

	function run(
		nmn,
		$ionicPlatform
	) {
		$ionicPlatform.ready(
			function() {
				window.nmn = nmn;
			}
		);
	}
}());
