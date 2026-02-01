// Mock mechanic data
export const mockMechanics = [
    {
        id: 'M01',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        rating: 4.8,
        avatar: '👨‍🔧',
        vehicle: 'Mahindra Bolero',
        specialization: 'Engine \u0026 Electrical'
    },
    {
        id: 'M02',
        name: 'Amit Sharma',
        phone: '+91 98123 45678',
        rating: 4.6,
        avatar: '👨‍🔧',
        vehicle: 'Tata Ace',
        specialization: 'Tires \u0026 Brakes'
    },
    {
        id: 'M03',
        name: 'Suresh Patil',
        phone: '+91 97654 32109',
        rating: 4.9,
        avatar: '👨‍🔧',
        vehicle: 'Force Traveller',
        specialization: 'Full Service'
    }
];

// Mock request status flow
export const statusFlow = {
    assigned: {
        label: 'Mechanic Assigned',
        next: 'on_the_way',
        color: 'warning',
        delay: 3000 // 3s
    },
    on_the_way: {
        label: 'On the Way',
        next: 'arriving',
        color: 'success',
        delay: 5000 // 5s
    },
    arriving: {
        label: 'Arriving Soon',
        next: 'arrived',
        color: 'light',
        delay: 4000 // 4s
    },
    arrived: {
        label: 'Arrived',
        next: null,
        color: 'light',
        delay: null
    }
};

// Generate mock request
export function createMockRequest(text, lat, lon) {
    const randomMechanic = mockMechanics[Math.floor(Math.random() * mockMechanics.length)];

    return {
        id: `REQ-${Date.now()}`,
        text,
        location: { lat, lon },
        status: 'assigned',
        priority: 'normal',
        eta_minutes: Math.floor(Math.random() * 15) + 10, // 10-25 mins
        mechanic_id: randomMechanic.id,
        mechanic: randomMechanic,
        created_at: new Date().toISOString(),
        distance_meters: Math.floor(Math.random() * 3000) + 500 // 500-3500m
    };
}

// Simulate status progression
export function simulateStatusProgression(currentStatus, onUpdate) {
    const statusInfo = statusFlow[currentStatus];

    if (!statusInfo || !statusInfo.next) {
        return null; // No more transitions
    }

    const timeoutId = setTimeout(() => {
        onUpdate(statusInfo.next);
    }, statusInfo.delay);

    return timeoutId;
}
