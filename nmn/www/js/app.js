(function() {
	'use strict';

	angular
		.module(
			'starter', [
				'ionic',
			]
		)
		.config(config)
		.run(run)

	;

	function config(
		$stateProvider,
		$urlRouterProvider
	) {
		/*
		$stateProvider
			.state('login', {
				controller: 'Login as _',
				templateUrl: 'templates/login.html',
				url: '/login',
			})

		;

		$urlRouterProvider.otherwise('/login');
		*/
	}

	function run(
		$ionicPlatform
	) {
		$ionicPlatform.ready(
			function() {
				console.log('ready');
			}
		);
	}
}());
