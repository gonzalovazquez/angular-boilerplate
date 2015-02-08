describe('angular-boilerplate', function() {

  beforeEach(function() {
    browser.get(browser.baseUrl);
  });

  it('should load angularjs', function() {
    console.log(browser.get(browser.baseUrl));
    var name = element(by.binding('name'));

    expect(name.getText()).toEqual('Hello Friend');
  });

});