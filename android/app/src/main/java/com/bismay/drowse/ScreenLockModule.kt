package com.bismay.drowse


import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName():String{
        return  "ScreenLock"
    }

    @ReactMethod
    fun lockScreen() {
        try {
            val devicePolicyManager = reactApplicationContext.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val adminComponent = ComponentName(reactApplicationContext, DeviceAdminReceiver::class.java)

            if (devicePolicyManager.isAdminActive(adminComponent)) {
                devicePolicyManager.lockNow()
            } else {
                // Log or handle case where device admin is not enabled
                println("Device admin not enabled")
            }
        }catch (e: Exception) {
            println("Error locking screen: ${e.message}")
        }
    }
}