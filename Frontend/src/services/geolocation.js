/**
 * Geolocation service for GPS tracking
 */

const DEFAULT_LOCATION = {
    lat: 21.1458,  // Nagpur coordinates as fallback
    lon: 79.0882
};

/**
 * Get current user location
 */
export async function getCurrentLocation() {
    if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using default location');
        return DEFAULT_LOCATION;
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                console.error('Geolocation error:', error.message);
                // Fallback to default location
                resolve(DEFAULT_LOCATION);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

/**
 * Watch position changes (for mechanic tracking)
 */
export function watchLocation(callback, onError) {
    if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        return null;
    }

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            callback({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            });
        },
        (error) => {
            console.error('Watch position error:', error.message);
            if (onError) onError(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        }
    );

    // Return function to stop watching
    return () => navigator.geolocation.clearWatch(watchId);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters) {
    if (meters < 1000) {
        return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Request location permission
 */
export async function requestLocationPermission() {
    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
        console.warn('Permission API not supported');
        return 'prompt';
    }
}
