(function() {
	'use strict';

	angular
		.module(
			'starter', [
				'controllers',
				'directives',
				'ionic',
				'ionic.service.core',
				'ionic.service.deploy',
				'services',
			]
		)
		.value('G', {})
		.config(config)
		.run(run)

	;

	function config(
		$ionicAppProvider,
		$stateProvider,
		$urlRouterProvider
	) {
		$ionicAppProvider
			.identify({
				app_id: '53eb088d',
				api_key: 'c4219134990fb03d6b6e52bc15ab4bd240912a60b84a5004',
			});

		$stateProvider
			.state(
				'sideMenus', {
					abstract: true,
					controller: 'SideMenu as _',
					templateUrl: 'templates/sideMenus.html',
					url: '/',
				}
			)
			.state(
				'sideMenus.home', {
					resolve: {
						'ionicDeploy': function($ionicDeploy, $ionicLoading, $ionicPlatform, $ionicPopup, $q) {
							var d;

							d = $q.defer();

							$ionicPlatform.ready(
								function() {
									$ionicDeploy
										.check()
										.then(
											function(hasUpdate) {
												if (!hasUpdate) {
													return d.resolve(hasUpdate);
												}

												$ionicPopup
													.confirm({
														template: 'Do you want to update?',
														title: 'New Version',
													})
													.then(
														function(res) {
															if (!res) {
																return d.resolve(res);
															}

															$ionicDeploy
																.update()
																.then(
																	function(res) {
																		console.log('Ionic Deploy: Update Success! ', res);
																	},
																	function(err) {
																		console.log('Ionic Deploy: Update error! ', err);
																	},
																	function(prog) {
																		$ionicLoading.show('Updating... ' + prog + '%');
																	}
																);
														}
													)

											},
											function() {
												$ionicPopup
													.alert({
														template: 'Unable to check for updates',
														title: 'Ionic Deploy',
													})
													.then(
														function() {
															return d.resolve(null);
														}
													);
											}
										);
								}
							);

							return d.promise;
						},
					},
					url: 'home',
					views: {
						'sideMenus': {
							controller: 'Home as _',
							templateUrl: 'templates/home.html',
						},
					},
				}
			)

		;

		$urlRouterProvider.otherwise('/home');
	}

	function run(
		$ionicPlatform
	) {
		$ionicPlatform.ready(
			function() {}
		);
	}
}());
