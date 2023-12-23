import { Canister, query, text, update, Record, Vec, Opt, Void } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Doctor = {
    doctorId: string;
    name: string;
    specialization: string;
    schedule: Vec<Schedule>;
};

type Schedule = {
    day: string;
    startTime: string;
    endTime: string;
};

let doctors: Doctor[] = [];

export default Canister({
    getDoctorInfo: query([text], Vec(Record({
        "doctorId": text,
        "name": text,
        "specialization": text,
        "schedule": Vec(Record({
            "day": text,
            "startTime": text,
            "endTime": text
        }))
    })), (doctorName) => {
        const doctor = doctors.find((doc) => doc.name === doctorName);
        return doctor ? [doctor] : [];
    }),

    registerDoctor: update([text, text, Vec(Record({
        "day": text,
        "startTime": text,
        "endTime": text
    }))], Void, (name, specialization, schedule) => {
        // Validation checks for name, specialization, and schedule can be added here.
        if (!name || !specialization || schedule.length === 0) {
            console.error('Invalid registration data. Name, specialization, and schedule are required.');
            return;
        }

        const newDoctor: Doctor = { doctorId: uuidv4(), name, specialization, schedule };
        doctors.push(newDoctor);
        console.log(`Registered new doctor: ${newDoctor.name} (ID: ${newDoctor.doctorId})`);
    }),

    getDoctorSchedule: query([text], Vec(Record({
        "day": text,
        "startTime": text,
        "endTime": text
    })), (doctorName) => {
        const doctor = doctors.find((doc) => doc.name === doctorName);
        return doctor ? doctor.schedule : [];
    }),

    searchDoctorsBySpecialization: query([text], Vec(Record({
        "doctorId": text,
        "name": text,
        "specialization": text,
        "schedule": Vec(Record({
            "day": text,
            "startTime": text,
            "endTime": text
        }))
    })), (specialization) => {
        const filteredDoctors = doctors.filter((doc) => doc.specialization === specialization);
        return filteredDoctors;
    })
});
