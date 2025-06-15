package com.bismay.drowse


//import android.app.admin.DevicePolicyManager
//import android.content.ComponentName
//import android.content.Context
//import com.facebook.react.bridge.ReactApplicationContext
//import com.facebook.react.bridge.ReactContextBaseJavaModule
//import com.facebook.react.bridge.ReactMethod
//import com.facebook.react.bridge.WritableArray
//import com.facebook.react.bridge.WritableMap
//import com.facebook.react.bridge.Arguments

import android.app.admin.DevicePolicyManager
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.*
import java

import android.util.Log
import android.util.Base64
import com.facebook.react.modules.core.DeviceEventManagerModule


class ScreenLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName():String{
        return  "ScreenLock"
    }
    init {
        Log.d("ScreenLock Module", "ScreenLockModule instantiated")
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

    @ReactMethod
    fun getAppUsageStats(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val calendar = Calendar.getInstance()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()

            val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
            val result: WritableArray = Arguments.createArray()

            stats?.forEach { usageStat ->
                val map: WritableMap = Arguments.createMap()
                map.putString("packageName", usageStat.packageName)
                map.putDouble("totalTimeInForeground", usageStat.totalTimeInForeground / 1000.0)
                map.putString("appName", getAppName(usageStat.packageName))
                map.putString("appIcon", getAppIconBase64(usageStat.packageName))
                result.pushMap(map)
            }

            Log.d("AppUsageModule", "Returning ${result.toArrayList().size} apps with usage data")
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Error fetching usage stats", e)
            promise.reject("USAGE_STATS_ERROR", e.message)
        }
    }

    private fun getAppName(packageName: String): String {
        return try {
            val packageManager = reactApplicationContext.packageManager
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            packageName
        }
    }

    private fun getAppIconBase64(packageName: String): String? {
        try {
            Log.v("AppUsageModule", "Fetching icon for $packageName")
            val packageManager = reactApplicationContext.packageManager
            val appInfo = packageManager.getApplicationInfo(packageName, 0)

            // Try multiple methods to get the icon
            var drawable: Drawable? = null
            try {
                drawable = packageManager.getApplicationIcon(appInfo)
            } catch (e: PackageManager.NameNotFoundException) {
                Log.w("AppUsageModule", "getApplicationIcon failed for $packageName: ${e.message}")
            }

            // Fallback: Try loading icon from resources
            if (drawable == null && appInfo.icon != 0) {
                try {
                    drawable = packageManager.getDrawable(packageName, appInfo.icon, appInfo)
                    Log.v("AppUsageModule", "Loaded icon from resources for $packageName")
                } catch (e: Exception) {
                    Log.w("AppUsageModule", "Failed to load resource icon for $packageName: ${e.message}")
                }
            }

            if (drawable == null) {
                Log.w("AppUsageModule", "No drawable found for $packageName")
                return null
            }

            // Convert drawable to bitmap
            val bitmap = when (drawable) {
                is BitmapDrawable -> {
                    Log.v("AppUsageModule", "Drawable for $packageName is BitmapDrawable")
                    drawable.bitmap
                }
                is AdaptiveIconDrawable -> {
                    Log.v("AppUsageModule", "Drawable for $packageName is AdaptiveIconDrawable")
                    // Combine foreground and background layers
                    val size = 48
                    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
                    val canvas = Canvas(bitmap)
                    drawable.setBounds(0, 0, size, size)
                    drawable.draw(canvas)
                    bitmap
                }
                else -> {
                    Log.v("AppUsageModule", "Drawable for $packageName is ${drawable.javaClass.name}, converting to bitmap")
                    val size = 48
                    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
                    val canvas = Canvas(bitmap)
                    drawable.setBounds(0, 0, size, size)
                    drawable.draw(canvas)
                    bitmap
                }
            }

            if (bitmap == null || bitmap.isRecycled) {
                Log.w("AppUsageModule", "Bitmap is null or recycled for $packageName")
                return null
            }

            // Compress bitmap to PNG and encode to Base64
            val stream = ByteArrayOutputStream()
            try {
                bitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)
                val byteArray = stream.toByteArray()
                val base64 = Base64.encodeToString(byteArray, Base64.DEFAULT)
                Log.v("AppUsageModule", "Encoded icon for $packageName, Base64 length: ${base64.length}")
                return base64
            } finally {
                stream.close()
            }
        } catch (e: PackageManager.NameNotFoundException) {
            Log.w("AppUsageModule", "Package not found for $packageName: ${e.message}")
            return null
        } catch (e: Exception) {
            Log.e("AppUsageModule", "Failed to encode icon for $packageName: ${e.message}", e)
            return null
        }
    }

    @ReactMethod
    fun checkUsagePermission(promise: Promise) {
        val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        val startTime = calendar.timeInMillis
        val endTime = System.currentTimeMillis()

        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
        promise.resolve(stats != null && stats.isNotEmpty())
    }
}