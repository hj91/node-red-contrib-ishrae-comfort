# node-red-contrib-ishrae-comfort

A Node-RED node for calculating PMV (Predicted Mean Vote) and PPD (Predicted Percentage of Dissatisfied) indices according to the ISHRAE (Indian Society of Heating, Refrigerating and Air Conditioning Engineers) Thermal Comfort Standard.

## Installation

To install this node, navigate to your Node-RED user directory (usually `~/.node-red`) and run:

```bash
npm install node-red-contrib-ishrae-comfort
```

Then, restart your Node-RED instance.

## Usage

The "ISHRAE Comfort" node accepts an input message with the following properties in the payload:

- `Ta`: Air temperature (°C)
- `Tr`: Mean radiant temperature (°C)
- `Va`: Air velocity (m/s)
- `RH`: Relative humidity (%)
- `Met`: Metabolic rate (met)
- `Clo`: Clothing insulation (clo)

For example, the input message should look like this:

```javascript
{
  "payload": {
    "Ta": 25,
    "Tr": 25,
    "Va": 0.1,
    "RH": 50,
    "Met": 1.0,
    "Clo": 0.5
  }
}
```

The "ISHRAE Comfort" node will calculate the PMV and PPD values based on these inputs and return an output message with the calculated values in the payload:

```javascript
{
  "payload": {
    "PMV": -0.363,
    "PPD": 6.42
  }
}
```

## License

ISC License (ISC) © 2023 Harshad Joshi (hj91)

## Example flow

The example flow can be found in the `examples/` directory, which can be imported from Node-RED.
