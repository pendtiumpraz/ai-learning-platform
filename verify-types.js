const fs = require('fs');
const path = require('path');

// Simple type verification script
console.log('🔍 Verifying TypeScript type definitions...\n');

const typeFiles = [
  'src/types/index.ts',
  'src/types/learning.ts',
  'src/types/agents.ts',
  'src/types/ai.ts',
  'src/types/game.ts',
  'src/types/api.ts'
];

const componentFiles = [
  'src/components/llm-playground/CodePlayground.tsx',
  'src/components/prompt-tutorials/PromptTutorial.tsx',
  'src/components/gamification/AchievementSystem.tsx'
];

let errors = [];
let warnings = [];

// Check if type files exist
console.log('📁 Checking type files...');
typeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    errors.push(`❌ ${file} missing`);
  }
});

// Check if components exist
console.log('\n📁 Checking component files...');
componentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    warnings.push(`⚠️  ${file} missing`);
  }
});

// Check type file exports
console.log('\n🔗 Checking type exports...');
try {
  const indexContent = fs.readFileSync('src/types/index.ts', 'utf8');

  // Check for main exports
  const expectedExports = [
    'export \\* from \'./learning\'',
    'export \\* from \'./agents\'',
    'export \\* from \'./ai\'',
    'export \\* from \'./game\'',
    'export \\* from \'./api\''
  ];

  expectedExports.forEach(exportStatement => {
    if (indexContent.includes(exportStatement.replace('\\', ''))) {
      console.log(`✅ ${exportStatement.replace('\\', '')} found`);
    } else {
      errors.push(`❌ Missing export: ${exportStatement.replace('\\', '')}`);
    }
  });

} catch (error) {
  errors.push(`❌ Error reading index.ts: ${error.message}`);
}

// Check tsconfig.json
console.log('\n⚙️  Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

    if (tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl) {
      console.log(`✅ baseUrl configured: ${tsconfig.compilerOptions.baseUrl}`);
    } else {
      warnings.push('⚠️  baseUrl not configured in tsconfig.json');
    }

    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      const paths = Object.keys(tsconfig.compilerOptions.paths);
      console.log(`✅ Path aliases configured: ${paths.join(', ')}`);
    } else {
      warnings.push('⚠️  Path aliases not configured in tsconfig.json');
    }

  } catch (error) {
    errors.push(`❌ Error parsing tsconfig.json: ${error.message}`);
  }
} else {
  errors.push('❌ tsconfig.json not found');
}

// Check package.json for TypeScript dependencies
console.log('\n📦 Checking TypeScript dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (packageJson.dependencies && packageJson.dependencies.typescript) {
    console.log(`✅ TypeScript in dependencies: ${packageJson.dependencies.typescript}`);
  } else if (packageJson.devDependencies && packageJson.devDependencies.typescript) {
    console.log(`✅ TypeScript in devDependencies: ${packageJson.devDependencies.typescript}`);
  } else {
    errors.push('❌ TypeScript not found in package.json');
  }

  const typeDeps = ['@types/react', '@types/node', '@types/react-dom'];
  typeDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} found: ${packageJson.dependencies[dep]}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} found: ${packageJson.devDependencies[dep]}`);
    } else {
      warnings.push(`⚠️  ${dep} not found`);
    }
  });

} catch (error) {
  errors.push(`❌ Error reading package.json: ${error.message}`);
}

// Summary
console.log('\n📊 SUMMARY');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 All type definitions are properly configured!');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(error => console.log(error));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warning => console.log(warning));
  }
}

console.log('\n✨ Type verification complete!');
process.exit(errors.length > 0 ? 1 : 0);