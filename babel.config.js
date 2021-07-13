const presets = [
  [
    '@babel/preset-env',
    {
      targets : {
        node : true
      }
    }
  ]
];

const plugins = [ '@babel/plugin-proposal-class-properties' ];

module.exports = { presets, plugins };
