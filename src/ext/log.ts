const log = console.log;

console.log = function (...args) {
    args.unshift(new Date());
    log.apply(console ,args);       
}
