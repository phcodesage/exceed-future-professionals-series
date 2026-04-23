import { Stethoscope, Smile, Scale, PawPrint, Pill, ChefHat, FlaskConical, Palette } from 'lucide-react';

export const programs = [
    {
        id: 'chef',
        name: 'Future Chef',
        icon: ChefHat,
        startDate: 'May 6',
        hasSyllabus: true,
        videos: [],
        content: [
            {
                title: '8-Week Program',
                ceremony: '',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 10, 17, 24, 31, June 7, 14, 21, 28' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'May 6, 13, 20, 27, June 3, 10, 17, 24' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 10, 17, 24, 31, June 7, 14, 21, 28' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'May 6, 13, 20, 27, June 3, 10, 17, 24' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 10, 17, 24, 31, June 7, 14, 21, 28' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'May 6, 13, 20, 27, June 3, 10, 17, 24' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'Welcome Little Chefs', desc: 'Kitchen safety and tools' },
                    { week: 'Week 2', title: 'Measuring, Mixing and Math', desc: 'Math in the kitchen' },
                    { week: 'Week 3', title: 'Fruits, Veggies and Healthy Eating', desc: 'Nutrition made fun' },
                    { week: 'Week 4', title: 'Breakfast Bonanza', desc: 'Learn easy, kid-friendly breakfast recipes' },
                    { week: 'Week 5', title: 'Baking Basics', desc: 'Becoming a mini baker' },
                    { week: 'Week 6', title: 'Around the World Cooking Adventure', desc: 'Explore global cuisines: spices, herbs and cultural differences' },
                    { week: 'Week 7', title: 'Tasty Snacks and Creativity', desc: 'Healthy vs. unhealthy snacks. Salty, sweet, sour, crunchy, creamy' },
                    { week: 'Week 8', title: 'Healthy Meals and Smart Eating', desc: 'How to build a balanced plate' },
                ],
            },
        ],
    },
    {
        id: 'artist',
        name: 'Future Artist',
        icon: Palette,
        startDate: 'May 1',
        hasSyllabus: true,
        videos: [],
        content: [
            {
                title: '8-Week Program',
                ceremony: '',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 3, 10, 17, 24, 31, June 7, 14, 21' },
                            { label: 'Fridays', time: 'Fridays 4-5pm', dates: 'May 1, 8, 15, 22, 29, June 5, 12, 19' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 3, 10, 17, 24, 31, June 7, 14, 21' },
                            { label: 'Fridays', time: 'Fridays 4-5pm', dates: 'May 1, 8, 15, 22, 29, June 5, 12, 19' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 3, 10, 17, 24, 31, June 7, 14, 21' },
                            { label: 'Fridays', time: 'Fridays 4-5pm', dates: 'May 1, 8, 15, 22, 29, June 5, 12, 19' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'Welcome Artists – Elements of Art', desc: 'The 7 elements of art' },
                    { week: 'Week 2', title: 'Color Theory Magic', desc: 'Primary, secondary and tertiary colors. Warm vs. cold' },
                    { week: 'Week 3', title: 'Drawing Skills', desc: 'Shapes, shadows and shading' },
                    { week: 'Week 4', title: 'Painting Techniques', desc: 'Brush types, water vs. acrylic colors' },
                    { week: 'Week 5', title: 'Sculpture and 3D Art', desc: 'Clay sculpture basics' },
                    { week: 'Week 6', title: 'Art Around the World', desc: 'Global art traditions and styles, patterns, symbols and strategies' },
                    { week: 'Week 7', title: 'Mixed Media and Creative Expressions', desc: 'Combining materials, layering techniques, collage, texture and patterns' },
                    { week: 'Week 8', title: 'Art Show and Young Artist Graduation', desc: 'Creating artwork' },
                ],
            },
        ],
    },
    {
        id: 'doctor',
        name: 'Future Doctor',
        icon: Stethoscope,
        hasSyllabus: true,
        videos: [
            '/videos/doctor-kids.mp4',
        ],
        content: [
            {
                title: 'Semester 1 - 6 weeks',
                ceremony: '',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Oct 4, 11, 18, 25, Nov 1, Nov 8' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Oct 7, 14, 28, Nov 4, Nov 11' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Oct 4, 11, 18, 25, Nov 1, Nov 8' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Oct 7, 14, 28, Nov 4, Nov 11' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Oct 4, 11, 18, 25, Nov 1, Nov 8' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Oct 7, 14, 28, Nov 4, Nov 11' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'First Aid Heroes', desc: 'Learn to help in emergencies' },
                    { week: 'Week 2', title: "That's Gross (but cool)", desc: 'Medical science of the "Yucky Stuff"' },
                    { week: 'Week 3', title: 'Pharmacy Fun', desc: 'Explore the world of prescriptions and medications' },
                    { week: 'Week 4', title: 'Medical Tools and Doctor Skills', desc: 'Learn how real doctors use tools' },
                    { week: 'Week 5', title: 'How Doctors Diagnose', desc: 'Understanding signs, symptoms and thinking like a doctor' },
                    { week: 'Week 6', title: 'Healthy Habits for Super Kids', desc: 'What doctors recommend to stay healthy' },
                ],
            },
            {
                title: 'Semester 2 - 6 weeks + White Coat Ceremony',
                ceremony: 'White Coat Ceremony and Graduation: December 27 at 2pm',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Nov 15, 22, 29, Dec 6, Dec 13, Dec 20' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Nov 18, 25, Dec 2, 9, 16, 23' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Nov 15, 22, 29, Dec 6, Dec 13, Dec 20' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Nov 18, 25, Dec 2, 9, 16, 23' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'Nov 15, 22, 29, Dec 6, Dec 13, Dec 20' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Nov 18, 25, Dec 2, 9, 16, 23' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'The Amazing Brain', desc: 'Explore the organ that runs the whole body' },
                    { week: 'Week 2', title: 'Your Spine is Fine', desc: "The body's super strong support system" },
                    { week: 'Week 3', title: 'The Beating Heart and Blood', desc: '' },
                    { week: 'Week 4', title: 'Lungs and Breathing', desc: 'Lung expansion, diaphragm movement. Why smoking and pollution harms lungs' },
                    { week: 'Week 5', title: 'The Digestive Adventure', desc: 'Journey of food. Good vs. Bad bacteria' },
                    { week: 'Week 6', title: 'Muscles and Movements', desc: 'How muscles contract, common injuries and prevention' },
                ],
            },
        ],
    },
    {
        id: 'dentist',
        name: 'Future Dentist',
        icon: Smile,
        hasSyllabus: true,
        videos: [
            '/videos/dentist-kid.mp4',
        ],
        content: [
            {
                title: 'Semester 1 - 6 weeks',
                ceremony: '',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Jan 10, 17, 24, 31, Feb 7, 14' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Jan 13, 20, 27, Feb 3, 10, 17' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Jan 10, 17, 24, 31, Feb 7, 14' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Jan 13, 20, 27, Feb 3, 10, 17' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Jan 10, 17, 24, 31, Feb 7, 14' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'Jan 13, 20, 27, Feb 3, 10, 17' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'Dental First Aid', desc: 'What to do when something goes wrong with your teeth' },
                    { week: 'Week 2', title: 'The Mighty Mouth', desc: 'Explore the anatomy and function of the mouth' },
                    { week: 'Week 3', title: "That's Gross – Dental Edition", desc: 'The yucky but fascinating parts of oral health' },
                    { week: 'Week 4', title: 'Teeth and Tools', desc: 'Become a little dentist' },
                    { week: 'Week 5', title: "The Tooth Fairy's Pharmacy", desc: 'Dental treatments, medications and prevention' },
                    { week: 'Week 6', title: 'Healthy Smiles', desc: 'Habits that protect your teeth' },
                ],
            },
            {
                title: 'Semester 2 - 6 weeks + White Coat Ceremony',
                ceremony: 'White Coat Ceremony and Graduation: April 14 at 5pm',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Feb 21, 28, March 7, 14, April 4, 11' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'March 3, 10, 17, 24, 31, April 7' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Feb 21, 28, March 7, 14, April 4, 11' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'March 3, 10, 17, 24, 31, April 7' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 3-4pm', dates: 'Feb 21, 28, March 7, 14, April 4, 11' },
                            { label: 'Wednesdays', time: 'Wednesdays 4-5pm', dates: 'March 3, 10, 17, 24, 31, April 7' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'The Science of Cavities', desc: 'How plaque is formed and what acid does to enamel' },
                    { week: 'Week 2', title: 'Baby Teeth vs. Adult Teeth', desc: 'Why baby teeth fall out, and how adult teeth are different' },
                    { week: 'Week 3', title: 'Gums, Tongue and Saliva', desc: 'What healthy gums look like' },
                    { week: 'Week 4', title: 'X-Rays and Dental Technology', desc: 'How x-rays work' },
                    { week: 'Week 5', title: 'Orthodontics', desc: 'Braces, spacers and aligners' },
                    { week: 'Week 6', title: 'Build Your Own Dental Office', desc: 'Roles in dental office' },
                ],
            },
        ],
    },
    {
        id: 'lawyer',
        name: 'Future Lawyer',
        icon: Scale,
        hasSyllabus: true,
        videos: [],
        content: [
            {
                title: '7-Week Program',
                ceremony: '',
                schedules: [
                    {
                        grades: 'K-2 (Ages 4-7)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 2, 9, 16, 23, 30, June 6, 13, 20' },
                        ],
                    },
                    {
                        grades: '3-5 (Ages 8-11)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 2, 9, 16, 23, 30, June 6, 13, 20' },
                        ],
                    },
                    {
                        grades: '6-8 (Ages 12-15)',
                        options: [
                            { label: 'Sundays', time: 'Sundays 2-3pm', dates: 'May 2, 9, 16, 23, 30, June 6, 13, 20' },
                        ],
                    },
                ],
                syllabus: [
                    { week: 'Week 1', title: 'Introduction to Law', desc: 'What is law and how does it work?' },
                    { week: 'Week 2', title: 'Types of Law', desc: 'Criminal, civil, and constitutional law basics' },
                    { week: 'Week 3', title: 'The Court System', desc: 'How courts work and who works in them' },
                    { week: 'Week 4', title: 'Mock Trial Basics', desc: 'Roles in a trial and courtroom procedures' },
                    { week: 'Week 5', title: 'Evidence and Arguments', desc: 'Building a case and presenting evidence' },
                    { week: 'Week 6', title: 'Debate Skills', desc: 'Persuasive speaking and critical thinking' },
                    { week: 'Week 7', title: 'Mock Trial Competition', desc: 'Put your skills to the test in a mock trial' },
                ],
            },
        ],
    },
    {
        id: 'vet',
        name: 'Future Vet',
        icon: PawPrint,
        hasSyllabus: false,
        videos: [],
    },
    {
        id: 'pharmacist',
        name: 'Future Pharmacist',
        icon: Pill,
        hasSyllabus: false,
        videos: [],
    },
    {
        id: 'scientist',
        name: 'Future Scientist',
        icon: FlaskConical,
        hasSyllabus: false,
        videos: [],
    },
];
