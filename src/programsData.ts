import { Stethoscope, Smile, Scale, PawPrint, Pill, ChefHat, FlaskConical, Palette } from 'lucide-react';

export const programs = [
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
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: 'Option 1', time: 'Sundays 2-3', dates: 'Feb 22 - Apr 3' },
                            { label: 'Option 2', time: 'Wednesdays 4-5', dates: 'Feb 25 - Apr 1' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: 'Option 1', time: 'Sundays 3:30-4:30', dates: 'Feb 22 - Apr 3' },
                            { label: 'Option 2', time: 'Fridays 4-5', dates: 'Feb 27 - Apr 3' },
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
                ceremony: 'White Coat Ceremony and Graduation: all sections: May 24, 2pm.',
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: 'Option 1', time: 'Sundays 2-3', dates: 'Apr 12 - May 22' },
                            { label: 'Option 2', time: 'Wednesdays 4-5', dates: 'Apr 15 - May 20' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: 'Option 1', time: 'Sundays 3:30-4:30', dates: 'Apr 12 - May 22' },
                            { label: 'Option 2', time: 'Fridays 4-5', dates: 'Apr 17 - May 22' },
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
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: 'Option 1', time: 'Sundays 3-4', dates: 'Feb 22 - Apr 3' },
                            { label: 'Option 2', time: 'Thursdays 4-5', dates: 'Feb 26 - Apr 2' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: 'Option 1', time: 'Sundays 4:30-5:30', dates: 'Feb 22 - Apr 3' },
                            { label: 'Option 2', time: 'Thursdays 5:30-6:30', dates: 'Feb 26 - Apr 2' },
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
                ceremony: 'White Coat Ceremony and Graduation: all sections: May 24, 4pm.',
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: 'Option 1', time: 'Sundays 3-4', dates: 'Apr 12 - May 22' },
                            { label: 'Option 2', time: 'Thursdays 4-5', dates: 'Apr 16 - May 21' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: 'Option 1', time: 'Sundays 4:30-5:30', dates: 'Apr 12 - May 22' },
                            { label: 'Option 2', time: 'Thursdays 5:30-6:30', dates: 'Apr 16 - May 21' },
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
        id: 'chef',
        name: 'Young Chef',
        icon: ChefHat,
        hasSyllabus: true,
        videos: [],
        content: [
            {
                title: '8 Weeks Program',
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: '', time: 'Fridays 3:30-4:30pm', dates: 'May 1 - June 19' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: '', time: 'Fridays 5-6pm', dates: 'May 1 - June 19' },
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
        name: 'Young Artist',
        icon: Palette,
        hasSyllabus: true,
        videos: [],
        content: [
            {
                title: '8 Weeks Program - Coming in June!',
                schedules: [
                    {
                        grades: 'K-2',
                        options: [
                            { label: '', time: 'Schedule coming soon', dates: 'June 2026' },
                        ],
                    },
                    {
                        grades: '3-6',
                        options: [
                            { label: '', time: 'Schedule coming soon', dates: 'June 2026' },
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
        id: 'lawyer',
        name: 'Future Lawyer',
        icon: Scale,
        hasSyllabus: false,
        videos: [],
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
