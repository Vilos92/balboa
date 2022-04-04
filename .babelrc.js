module.exports = {
  presets: [['next/babel', {'preset-react': {runtime: 'automatic'}}]],
  plugins: ['babel-plugin-macros', 'inline-react-svg', ['styled-components', {ssr: true}]]
};
