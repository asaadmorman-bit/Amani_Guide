import axios from 'axios';

interface NormalizedBiometrics {
  hrv: number;
  restingHeartRate: number;
  sleepScore: number | null;
}

/**
 * Fetch sleep and recovery data from the Oura Cloud API (v2)
 */
export async function fetchOuraMetrics(accessToken: string): Promise<NormalizedBiometrics> {
  const response = await axios.get('https://api.ouraring.com/v2/usercollection/sleep', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  // Grab the most recent sleep entry block
  const latestSleep = response.data?.data?.[0];
  
  return {
    hrv: latestSleep?.average_hrv || 55,
    restingHeartRate: latestSleep?.lowest_heart_rate || 70,
    sleepScore: latestSleep?.score || null
  };
}

/**
 * Fetch cycle and recovery metrics from the WHOOP Developer API (v1)
 */
export async function fetchWhoopMetrics(accessToken: string): Promise<NormalizedBiometrics> {
  const response = await axios.get('https://api.prod.whoop.com/developer/v1/activity/recovery', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  const latestRecovery = response.data?.records?.[0];
  
  return {
    hrv: latestRecovery?.hrv_rmssd_milli_seconds || 55,
    restingHeartRate: latestRecovery?.resting_heart_rate_bpm || 70,
    sleepScore: latestRecovery?.score?.sleep_performance_percentage || null
  };
}