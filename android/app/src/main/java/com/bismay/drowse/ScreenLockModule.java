package com.bismay.drowse;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.PowerManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ScreenLockModule extends ReactContextBaseJavaModule {
    private DevicePolicyManager devicePolicyManager;
    private ComponentName adminComponent;

    public ScreenLockModule(ReactApplicationContext context) {
        super(context);
        devicePolicyManager = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);
        adminComponent = new ComponentName(context, DeviceAdminReceiver.class);
    }

    @Override
    public String getName() {
        return "ScreenLock";
    }

    @ReactMethod
    public void lockScreen() {
        if (devicePolicyManager.isAdminActive(adminComponent)) {
            devicePolicyManager.lockNow();
        } else {
            // Prompt user to enable Device Admin (implement later)
        }
    }
}