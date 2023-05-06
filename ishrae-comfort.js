/**

Copyright 2023, Harshad Joshi/Bufferstack.IO Analytics Technology LLP, Pune

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

**/



module.exports = function (RED) {
  function calculatePMV(Ta, Tr, Va, RH, Met, Clo) {
    // Constants
    const Pa = (RH / 100) * 10 * Math.exp(16.6536 - 4030.183 / (Ta + 235));
    const Fcl = Clo < 0.078 ? 1 + (1.29 * Clo) : 1.05 + (0.645 * Clo);
    const Icl = 0.155 * Clo;

    // Calculate PMV
    const M = Met * 58.15;
    const W = 0;
    const Hc = 2.67 + 0.161 * Va;
    const Tcl = (35.7 - (0.028 * (M - W))) / (3.96 * Math.pow(10, -8) * Fcl * (Math.pow(Tr + 273, 4) - Math.pow(Ta + 273, 4)) + Fcl * Hc);
    const PMV = (0.303 * Math.exp(-0.036 * M) + 0.028) * (M - 3.05 * Math.pow(10, -3) * (5733 - 6.99 * (M - W) - Pa) - 0.42 * ((M - W) - 58.15) - 1.7 * Math.pow(10, -5) * M * (5867 - Pa) - 0.0014 * M * (34 - Ta) - 3.96 * Math.pow(10, -8) * Fcl * (Math.pow(Tcl + 273, 4) - Math.pow(Ta + 273, 4)));
    return PMV;
  }

  function calculatePPD(PMV) {
    return 100 - 95 * Math.exp(-0.03353 * Math.pow(PMV, 4) - 0.2179 * Math.pow(PMV, 2));
  }

  function IshraeComfortNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    let parameters = {};

    node.on("input", function (msg, send, done) {
      parameters[msg.topic] = msg.payload;

      // Check if all required parameters are received
      if (
        "airTemperature" in parameters &&
        "radiantTemperature" in parameters &&
        "airVelocity" in parameters &&
        "relativeHumidity" in parameters &&
        "metabolicRate" in parameters &&
        "clothingInsulation" in parameters
      ) {
        const Ta = parameters["airTemperature"];
        const Tr = parameters["radiantTemperature"];
        const Va = parameters["airVelocity"];
        const RH = parameters["relativeHumidity"];
        const Met = parameters["metabolicRate"];
        const Clo = parameters["clothingInsulation"];

        const PMV = calculatePMV(Ta, Tr, Va, RH, Met, Clo);
        const PPD = calculatePPD(PMV);

        msg.payload = {
          PMV: PMV,
          PPD: PPD
        };

        send(msg);
        done();

        // Reset parameters after processing
        parameters = {};
      }
    });
  }

  RED.nodes.registerType("ishrae-comfort", IshraeComfortNode);
};

