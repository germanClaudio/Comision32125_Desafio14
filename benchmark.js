const autocannon = require("autocannon");

const { PassThrough } = require("stream");

const run = (url) => {
  const buf = [];
  const outputStream = new PassThrough();

  const inst = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(inst, { outputStream });

  outputStream.on("data", (data) => {
    buf.push(data);
  });

  inst.on("done", () => {
    process.stdout.write(Buffer.concat(buf));
  });
};

console.log("Running all benchmarks in parallel...")
run( "http://localhost:4000/auth-nobloq?username=dani&password=qwerty123")
run( "http://localhost:4000/auth-bloq?username=dani&password=qwerty123")
