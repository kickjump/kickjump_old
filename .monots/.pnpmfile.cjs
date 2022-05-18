function readPackage(pkg, context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  if (pkg.name === 'fast-sort') {
    // Make fast-sort a module package.

    pkg.main = 'dist/sort.js';
    pkg.module = 'dist/sort.es.js';
    pkg.type = 'module';
    pkg.exports = {
      '.': {
        import: './dist/sort.es.js',
        require: './dist/sort.js',
        types: './dist/sort.d.ts',
      },
      './package.json': './package.json',
    };
    context.log('`fast-sort` is now an ES module');
  }

  // if ((pkg.name = '@playwright-testing-library/test')) {
  //   pkg.exports = {
  //     '.': {
  //       require: './dist/index.js',
  //       types: './dist/sort.d.ts',
  //     },
  //     './fixture': {
  //       require: './fixture.js',
  //       types: './fixture.d.ts',
  //     },
  //     './package.json': './package.json',
  //   };
  // }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
