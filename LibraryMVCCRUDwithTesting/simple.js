beforeEach(done => {
  //Before each test we empty the database
  Book.remove({}, err => {
    done();
  });
});
