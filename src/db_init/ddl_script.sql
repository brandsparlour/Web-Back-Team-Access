-- Companies table
CREATE TABLE Companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    contact VARCHAR(50),
    logo VARCHAR(255),
    privacy_policy TEXT,
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    designation VARCHAR(50)
);

-- Employees table
CREATE TABLE Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    role_id INT,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) ,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    profile_image VARCHAR(255),
    address VARCHAR(255),
    reporting_to INT,
    locations_responsible TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (reporting_to) REFERENCES Employees(employee_id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Customers table
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    dob DATE,
    profile_image VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- internAffiliateLinks table 
CREATE TABLE internAffiliateLinks (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    created_by INT,
    job_details TEXT,
    link VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (created_by) REFERENCES Employees(employee_id)
);

-- Internships table
CREATE TABLE Internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    payment_type ENUM('PAID', 'FREE') DEFAULT 'PAID',
    registration_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Interns table
CREATE TABLE Interns (
    intern_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    employee_id INT NOT NULL,
    link_id INT,
    referred_by INT,
    intern_type ENUM('ORGANIZER', 'INFLUENCER'),
    internship_id INT NOT NULL,
    course VARCHAR(255),
    year INT,
    college VARCHAR(255),
    university VARCHAR(255),
    photo VARCHAR(255),
    identity_card VARCHAR(255),
    payment_status ENUM('PAID', 'PENDING'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (link_id) REFERENCES internAffiliateLinks(link_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (referred_by) REFERENCES Employees(employee_id),
    FOREIGN KEY (internship_id) REFERENCES Internships(internship_id)
);

-- Events table
CREATE TABLE Events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    event_category VARCHAR(255),
    organizer VARCHAR(255),
    contact_info VARCHAR(255),
    registration_link VARCHAR(255),
    event_capacity INT,
    event_image VARCHAR(255),
    status ENUM('Upcoming', 'Past', 'Cancelled'),
    registration_status ENUM('Open', 'Closed'),
    payment_type ENUM('PAID', 'FREE') DEFAULT 'PAID',
    registration_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- EventParticipants table
CREATE TABLE EventParticipants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    customer_id INT NOT NULL,
    event_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(15),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('PAID', 'PENDING') DEFAULT 'PENDING',
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- PaymentOrders table
CREATE TABLE PaymentOrders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_order_for ENUM('INTERNSHIP', 'EVENT', 'STORE', 'PROMOTION'),
    payment_gateway ENUM('RAZOR_PAY', 'CASH_FREE'),
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI'),
    transaction_id VARCHAR(100),
    payment_status ENUM('PAID', 'PENDING', 'FAILED', 'REFUNDED'),
    employee_id INT,
    customer_id INT,
    item_id INT,
    billing_details TEXT,
    payment_gateway_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Payments table
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES PaymentOrders(order_id)
);

-- PromotionPlans table
CREATE TABLE PromotionPlans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(10),
    billing_cycle ENUM('Monthly', 'Annually'),
    features TEXT,
    customization_options TEXT,
    availability ENUM('Available', 'Not Available'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE Jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    location VARCHAR(255),
    description TEXT,
    salary VARCHAR(255),
    employment_type ENUM('Full-time', 'Part-time', 'Contract'),
    job_category VARCHAR(255),
    application_deadline DATE,
    experience_level VARCHAR(255),
    education VARCHAR(255),
    contact_email VARCHAR(255),
    posted_date DATE,
    application_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- Vacancies table
CREATE TABLE Vacancies (
    vacancy_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    company_id INT NOT NULL,
    number_of_positions INT,
    status ENUM('Open', 'Closed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- Applications table
CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    company_id INT NOT NULL,
    position_id INT,
    qualification VARCHAR(255),
    experience INT,
    application_status ENUM('Applied', 'Shortlisted', 'Rejected', 'Hired'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (position_id) REFERENCES Vacancies(vacancy_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Products table
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    stock_quantity INT,
    category VARCHAR(255),
    brand VARCHAR(255),
    product_images TEXT,
    product_SKU VARCHAR(255),
    average_rating DECIMAL(3,2),
    number_of_reviews INT,
    material VARCHAR(255),
    dimensions VARCHAR(255),
    weight VARCHAR(255),
    color VARCHAR(255),
    size VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ProductReviews table
CREATE TABLE ProductReviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    customer_id INT,
    rating INT,
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- ProductCategories table
CREATE TABLE ProductCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category INT,
    description TEXT,
    FOREIGN KEY (parent_category) REFERENCES ProductCategories(category_id)
);

-- ProductBrands table
CREATE TABLE ProductBrands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    description TEXT,
    brand_logo VARCHAR(255),
    brand_website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ProductWishList table
CREATE TABLE ProductWishList (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    products TEXT,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Cart table continued
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    products TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Notifications table
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('Receipt', 'Alert', 'Event Reminder'),
    content TEXT,
    notification_method ENUM('Email', 'SMS', 'In-app'),
    status ENUM('Sent', 'Pending', 'Failed', 'Read'),
    reference_id INT,
    reference_type ENUM('Event', 'Payment'),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);