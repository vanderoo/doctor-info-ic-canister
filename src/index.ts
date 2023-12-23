import { Canister, query, text, update, Record, Vec, Opt, Void } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Doctor = {
    id: string;
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
        "id": text,
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
        const newDoctor: Doctor = { id: uuidv4(), name, specialization, schedule };
        doctors.push(newDoctor);
        console.log('Registered new doctor:', newDoctor);
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
        "id": text,
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