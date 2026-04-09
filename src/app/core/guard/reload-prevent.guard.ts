import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '@code/interface/reload-prevent.interface';

export const reloadPreventGuard: CanDeactivateFn<CanComponentDeactivate> =
    (component) => {

        if (component && typeof component.canDeactivate === 'function') {
            return component.canDeactivate()
                ? true
                : confirm('Are you sure you want to leave? Your data will be lost.');
        }

        return true;
    };