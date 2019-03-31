$(function() {
  class Test {
    constructor(v) {
      this.da = v;
    }

    get daa() {
      return this.da;
    }
  }

  const da = new Test('Hye ped');

  console.log(da.da);
});
