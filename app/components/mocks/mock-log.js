import { observable } from 'mobx';

class MockLog {
    @observable list = '';
    beacon = null;
    lastTitle = '';

    start(title) {
        this.stopAndLog();
        this.log(`Starting ${title}`);
        this.lastTitle = title;
        this.beacon = new Date();
    }

    stopAndLog() {
        if (!this.beacon) return;
        const ms = new Date() - this.beacon;
        this.log(`${this.lastTitle} passed: ${ms} ms`);
        this.beacon = null;
        this.lastTitle = '';
    }

    log(line) {
        this.list += `${line}\n`;
    }
}

export default new MockLog();
