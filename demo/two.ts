import { Three as foobar } from './three';
import * as four from './four';

export function passThree() {
    return foobar();
}

four.Five();
