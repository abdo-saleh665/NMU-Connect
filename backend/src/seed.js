/**
 * Database Seed Script
 * Creates initial data for development/testing
 * 
 * Run with: node src/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Complaint = require('./models/Complaint');
const LostItem = require('./models/LostItem');
const Appointment = require('./models/Appointment');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nmu_connect');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        await Complaint.deleteMany({});
        await LostItem.deleteMany({});
        await Appointment.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const plainPassword = 'password123';

        // =====================
        // ADMIN USERS
        // =====================
        const admin = await User.create({
            email: 'admin@nmu.edu.eg',
            password: plainPassword,
            name: 'System Admin',
            nameAr: 'مدير النظام',
            role: 'admin',
            department: 'IT Administration',
            departmentAr: 'إدارة تقنية المعلومات',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiAXdiMDFducfoO-GV1NSX8dLZITG33McGYwEvb2N_zJY1NxoyUZoAPRc1Xai8OkNE4mQ1K1epbvGq5ffOy_pLvmvpPj9rNxDb2nFRuoeGUB0HhY0PlOoSIFtH-xEUVE_xw1OLi_rV_SeEuEgrfya2xyV1CnNPddh6qG_WNk7E9HgBSG7k3VdyKdiAReLPK3aaLOqwwpKF2TC8a050D2EhGw8_VdbpXrgyNbrK1b0qVAX-W7TDsGEliyKXhHCoN_HXec9DLTX4y0'
        });

        // =====================
        // FACULTY USERS
        // =====================
        const faculty1 = await User.create({
            email: 'dr.ahmed@nmu.edu.eg',
            password: plainPassword,
            name: 'Dr. Ahmed Hassan',
            nameAr: 'د. أحمد حسن',
            role: 'faculty',
            department: 'Computer Science',
            departmentAr: 'علوم الحاسب',
            office: '302',
            isTutor: true,
            tutorSubjects: ['Programming', 'Data Structures', 'AI'],
            tutorRating: 4.8,
            tutorSessions: 45,
            isAvailable: true,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSSxWDtmLKC2cbdTqkLlI6ngFA73SU4iF0aXNYGIKktvDyGOECITuCBUJd6LA5CnB_zsx7_FjT7pRFeIIKreTR_Xa5BmRaAtMSaNUoPcztVrKinBJY0pIdiseUOEeB7BKdAO5hM2nF3fvhSP9jmVDU8k-y0FNrZttwdnzw73rfx3aY2oJYu5n6tC-mbPDPFCqujxkJVatEovhP4xJcLJRljYNtuAhZVW729x4dmi7w6bfoV6mZxYU4A7NDgTGFOreA4EgnmQFkrgI'
        });

        const faculty2 = await User.create({
            email: 'dr.fatima@nmu.edu.eg',
            password: plainPassword,
            name: 'Dr. Fatima Ali',
            nameAr: 'د. فاطمة علي',
            role: 'faculty',
            department: 'Mathematics',
            departmentAr: 'الرياضيات',
            office: '215'
        });

        const faculty3 = await User.create({
            email: 'dr.mohamed@nmu.edu.eg',
            password: plainPassword,
            name: 'Prof. Mohamed Salem',
            nameAr: 'أ.د. محمد سالم',
            role: 'faculty',
            department: 'Medicine',
            departmentAr: 'الطب',
            office: '108',
            isTutor: true,
            tutorSubjects: ['Anatomy', 'Physiology'],
            tutorRating: 4.9,
            tutorSessions: 67,
            isAvailable: true
        });

        const faculty4 = await User.create({
            email: 'eng.mariam@nmu.edu.eg',
            password: plainPassword,
            name: 'Eng. Mariam Khaled',
            nameAr: 'م. مريم خالد',
            role: 'faculty',
            department: 'Engineering',
            departmentAr: 'الهندسة',
            office: '205'
        });

        const faculty5 = await User.create({
            email: 'dr.omar@nmu.edu.eg',
            password: plainPassword,
            name: 'Dr. Omar Youssef',
            nameAr: 'د. عمر يوسف',
            role: 'faculty',
            department: 'Business Administration',
            departmentAr: 'إدارة الأعمال',
            office: '401'
        });

        // =====================
        // STUDENT USERS
        // =====================
        const student1 = await User.create({
            email: 'ahmed.m@nmu.edu.eg',
            password: plainPassword,
            name: 'Ahmed Mohamed',
            nameAr: 'أحمد محمد',
            role: 'student',
            studentId: '20230154',
            department: 'Computer Science',
            departmentAr: 'علوم الحاسب',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY'
        });

        const student2 = await User.create({
            email: 'sara.a@nmu.edu.eg',
            password: plainPassword,
            name: 'Sara Ahmed',
            nameAr: 'سارة أحمد',
            role: 'student',
            studentId: '20230089',
            department: 'Computer Science',
            departmentAr: 'علوم الحاسب',
            isTutor: true,
            tutorSubjects: ['Calculus', 'Physics'],
            tutorRating: 4.9,
            tutorSessions: 38,
            isAvailable: true
        });

        const student3 = await User.create({
            email: 'youssef.k@nmu.edu.eg',
            password: plainPassword,
            name: 'Youssef Khaled',
            nameAr: 'يوسف خالد',
            role: 'student',
            studentId: '20230201',
            department: 'Engineering',
            departmentAr: 'الهندسة',
            isTutor: true,
            tutorSubjects: ['Mechanics', 'Thermodynamics'],
            tutorRating: 4.7,
            tutorSessions: 22,
            isAvailable: true
        });

        const student4 = await User.create({
            email: 'nour.h@nmu.edu.eg',
            password: plainPassword,
            name: 'Nour Hassan',
            nameAr: 'نور حسن',
            role: 'student',
            studentId: '20220156',
            department: 'Medicine',
            departmentAr: 'الطب'
        });

        const student5 = await User.create({
            email: 'omar.s@nmu.edu.eg',
            password: plainPassword,
            name: 'Omar Samir',
            nameAr: 'عمر سمير',
            role: 'student',
            studentId: '20230312',
            department: 'Business Administration',
            departmentAr: 'إدارة الأعمال'
        });

        const student6 = await User.create({
            email: 'layla.m@nmu.edu.eg',
            password: plainPassword,
            name: 'Layla Mahmoud',
            nameAr: 'ليلى محمود',
            role: 'student',
            studentId: '20220089',
            department: 'Computer Science',
            departmentAr: 'علوم الحاسب',
            isTutor: true,
            tutorSubjects: ['Web Development', 'Databases'],
            tutorRating: 4.6,
            tutorSessions: 15,
            isAvailable: true
        });

        const student7 = await User.create({
            email: 'mohamed.h@nmu.edu.eg',
            password: plainPassword,
            name: 'Mohamed Hany',
            nameAr: 'محمد هاني',
            role: 'student',
            studentId: '20210234',
            department: 'Computer Science',
            departmentAr: 'علوم الحاسب',
            isTutor: true,
            tutorSubjects: ['Data Structures', 'Algorithms'],
            tutorRating: 4.8,
            tutorSessions: 52,
            isAvailable: false
        });

        console.log('👥 Created 13 users (1 admin, 5 faculty, 7 students)');

        // =====================
        // EVENTS
        // =====================
        const now = new Date();
        await Event.insertMany([
            {
                title: 'AI Workshop',
                titleAr: 'ورشة الذكاء الاصطناعي',
                description: 'Learn the basics of Machine Learning and AI applications with hands-on projects',
                descriptionAr: 'تعلم أساسيات تعلم الآلة وتطبيقات الذكاء الاصطناعي مع مشاريع عملية',
                date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                location: 'Engineering Building, Room 201',
                locationAr: 'مبنى الهندسة، قاعة 201',
                category: 'workshop',
                organizer: faculty1._id,
                capacity: 50,
                attendees: [student1._id, student2._id, student6._id],
                isFeatured: true
            },
            {
                title: 'Career Fair 2025',
                titleAr: 'معرض التوظيف 2025',
                description: 'Connect with 50+ top employers and explore career opportunities in tech, medicine, and business',
                descriptionAr: 'تواصل مع أكثر من 50 شركة كبرى واستكشف فرص العمل في التقنية والطب والأعمال',
                date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
                location: 'Main Campus Hall',
                locationAr: 'القاعة الرئيسية بالحرم الجامعي',
                category: 'career',
                organizer: admin._id,
                capacity: 500,
                attendees: [student1._id, student3._id, student4._id, student5._id],
                isFeatured: true
            },
            {
                title: 'Web Development Bootcamp',
                titleAr: 'معسكر تطوير الويب',
                description: 'A 3-day intensive bootcamp covering React, Node.js, and MongoDB',
                descriptionAr: 'معسكر تدريبي مكثف لمدة 3 أيام يغطي React و Node.js و MongoDB',
                date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
                location: 'CS Building, Lab 3',
                locationAr: 'مبنى الحاسب، معمل 3',
                category: 'workshop',
                organizer: faculty1._id,
                capacity: 30,
                attendees: [student1._id, student6._id]
            },
            {
                title: 'Medical Conference 2025',
                titleAr: 'المؤتمر الطبي 2025',
                description: 'Annual medical conference featuring leading researchers and practitioners',
                descriptionAr: 'المؤتمر الطبي السنوي مع نخبة من الباحثين والأطباء',
                date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                location: 'Medical Sciences Auditorium',
                locationAr: 'قاعة العلوم الطبية',
                category: 'academic',
                organizer: faculty3._id,
                capacity: 200,
                isFeatured: true
            },
            {
                title: 'Entrepreneurship Workshop',
                titleAr: 'ورشة ريادة الأعمال',
                description: 'Learn how to turn your ideas into successful startups',
                descriptionAr: 'تعلم كيفية تحويل أفكارك إلى شركات ناشئة ناجحة',
                date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
                location: 'Business Building, Room 105',
                locationAr: 'مبنى الأعمال، قاعة 105',
                category: 'workshop',
                organizer: faculty5._id,
                capacity: 40
            },
            {
                title: 'Sports Day',
                titleAr: 'اليوم الرياضي',
                description: 'Annual university sports competition with multiple activities',
                descriptionAr: 'المنافسة الرياضية السنوية للجامعة مع أنشطة متعددة',
                date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                location: 'University Stadium',
                locationAr: 'ملعب الجامعة',
                category: 'sports',
                organizer: admin._id,
                capacity: 1000,
                attendees: [student1._id, student2._id, student3._id, student4._id, student5._id, student6._id, student7._id]
            }
        ]);
        console.log('📅 Created 6 events');

        // =====================
        // COMPLAINTS
        // =====================
        await Complaint.insertMany([
            {
                author: student1._id,
                title: 'Wi-Fi Connectivity Issues',
                titleAr: 'مشاكل في الاتصال بالواي فاي',
                description: 'The WiFi in Building B drops connection frequently, especially during peak hours',
                descriptionAr: 'الواي فاي في المبنى ب ينقطع بشكل متكرر خاصة في أوقات الذروة',
                type: 'university',
                category: 'it',
                status: 'under_review',
                votes: { up: [student2._id, student3._id, student4._id], down: [] }
            },
            {
                author: student2._id,
                title: 'Library Hours Extension',
                titleAr: 'تمديد ساعات المكتبة',
                description: 'Request to extend library hours until midnight during exam period',
                descriptionAr: 'طلب تمديد ساعات المكتبة حتى منتصف الليل خلال فترة الامتحانات',
                type: 'university',
                category: 'facilities',
                status: 'open',
                votes: { up: [student1._id, student4._id, student5._id, student6._id, student7._id], down: [] }
            },
            {
                author: student3._id,
                title: 'Parking Space Shortage',
                titleAr: 'نقص في مواقف السيارات',
                description: 'Not enough parking spaces for students, especially in the morning',
                descriptionAr: 'لا توجد مواقف كافية للطلاب خاصة في الصباح',
                type: 'university',
                category: 'facilities',
                status: 'open',
                votes: { up: [student1._id, student2._id], down: [student5._id] }
            },
            {
                author: student4._id,
                title: 'Lab Equipment Needs Update',
                titleAr: 'معدات المختبر تحتاج تحديث',
                description: 'The chemistry lab equipment is outdated and some are broken',
                descriptionAr: 'معدات مختبر الكيمياء قديمة وبعضها معطل',
                type: 'faculty',
                category: 'academic',
                status: 'resolved',
                votes: { up: [student1._id], down: [] }
            },
            {
                author: student5._id,
                title: 'Cafeteria Food Quality',
                titleAr: 'جودة طعام الكافتيريا',
                description: 'The food quality in the main cafeteria has declined recently',
                descriptionAr: 'جودة الطعام في الكافتيريا الرئيسية تراجعت مؤخراً',
                type: 'university',
                category: 'services',
                status: 'open',
                votes: { up: [student1._id, student2._id, student3._id, student4._id, student6._id], down: [] }
            },
            {
                author: student6._id,
                title: 'Course Registration System',
                titleAr: 'نظام تسجيل المواد',
                description: 'The online registration system crashed multiple times during registration period',
                descriptionAr: 'نظام التسجيل الإلكتروني توقف عدة مرات خلال فترة التسجيل',
                type: 'university',
                category: 'it',
                status: 'under_review',
                votes: { up: [student1._id, student2._id, student3._id, student7._id], down: [] }
            }
        ]);
        console.log('📝 Created 6 complaints');

        // =====================
        // LOST & FOUND ITEMS
        // =====================
        await LostItem.insertMany([
            {
                title: 'Black Laptop Charger',
                titleAr: 'شاحن لابتوب أسود',
                description: 'Dell laptop charger lost near the central library entrance',
                descriptionAr: 'شاحن لابتوب ديل مفقود بالقرب من مدخل المكتبة المركزية',
                type: 'lost',
                category: 'electronics',
                location: 'Central Library',
                locationAr: 'المكتبة المركزية',
                author: student1._id,
                status: 'active'
            },
            {
                title: 'Student ID Card',
                titleAr: 'بطاقة هوية طالب',
                description: 'Found a student ID card belonging to someone from Engineering dept',
                descriptionAr: 'تم العثور على بطاقة هوية طالب من كلية الهندسة',
                type: 'found',
                category: 'documents',
                location: 'Cafeteria',
                locationAr: 'الكافتيريا',
                author: student2._id,
                status: 'active'
            },
            {
                title: 'Silver Watch',
                titleAr: 'ساعة فضية',
                description: 'Casio silver watch with leather strap, sentimental value',
                descriptionAr: 'ساعة كاسيو فضية بحزام جلدي، لها قيمة عاطفية',
                type: 'lost',
                category: 'accessories',
                location: 'Sports Complex',
                locationAr: 'المجمع الرياضي',
                author: student3._id,
                status: 'active'
            },
            {
                title: 'Organic Chemistry Textbook',
                titleAr: 'كتاب الكيمياء العضوية',
                description: 'Found textbook with handwritten notes inside',
                descriptionAr: 'تم العثور على كتاب بداخله ملاحظات مكتوبة بخط اليد',
                type: 'found',
                category: 'books',
                location: 'Building B, Room 202',
                locationAr: 'المبنى ب، غرفة 202',
                author: student4._id,
                status: 'claimed'
            },
            {
                title: 'Blue Backpack',
                titleAr: 'حقيبة ظهر زرقاء',
                description: 'Nike blue backpack with books inside',
                descriptionAr: 'حقيبة ظهر نايك زرقاء بداخلها كتب',
                type: 'lost',
                category: 'accessories',
                location: 'Engineering Building',
                locationAr: 'مبنى الهندسة',
                author: student5._id,
                status: 'active'
            },
            {
                title: 'AirPods Case',
                titleAr: 'علبة AirPods',
                description: 'White AirPods case found near the CS building',
                descriptionAr: 'علبة AirPods بيضاء وجدت بالقرب من مبنى الحاسب',
                type: 'found',
                category: 'electronics',
                location: 'CS Building',
                locationAr: 'مبنى الحاسب',
                author: student6._id,
                status: 'active'
            },
            {
                title: 'Calculator',
                titleAr: 'آلة حاسبة',
                description: 'Casio scientific calculator, model fx-991',
                descriptionAr: 'آلة حاسبة علمية كاسيو موديل fx-991',
                type: 'lost',
                category: 'electronics',
                location: 'Math Building',
                locationAr: 'مبنى الرياضيات',
                author: student7._id,
                status: 'active'
            }
        ]);
        console.log('🔍 Created 7 lost & found items');

        // =====================
        // APPOINTMENTS
        // =====================
        await Appointment.insertMany([
            {
                student: student1._id,
                faculty: faculty1._id,
                scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // +2 days at 10 AM
                title: 'Discuss final year project ideas',
                notes: 'مناقشة أفكار مشروع التخرج',
                status: 'confirmed'
            },
            {
                student: student2._id,
                faculty: faculty2._id,
                scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // +3 days at 2 PM
                title: 'Academic advising',
                notes: 'إرشاد أكاديمي',
                status: 'pending'
            },
            {
                student: student4._id,
                faculty: faculty3._id,
                scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000), // +1 day at 11:30 AM
                title: 'Research opportunity discussion',
                notes: 'مناقشة فرص البحث',
                status: 'confirmed'
            }
        ]);
        console.log('📆 Created 3 appointments');

        console.log('\n✅ Seed completed successfully!');
        console.log('\n📋 Test Accounts:');
        console.log('   ─────────────────────────────────────');
        console.log('   Admin:    admin@nmu.edu.eg / password123');
        console.log('   Faculty:  dr.ahmed@nmu.edu.eg / password123');
        console.log('   Student:  ahmed.m@nmu.edu.eg / password123');
        console.log('   ─────────────────────────────────────');
        console.log('\n📊 Data Summary:');
        console.log('   • 13 Users (1 admin, 5 faculty, 7 students)');
        console.log('   • 6 Events');
        console.log('   • 6 Complaints');
        console.log('   • 7 Lost & Found Items');
        console.log('   • 3 Appointments');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
