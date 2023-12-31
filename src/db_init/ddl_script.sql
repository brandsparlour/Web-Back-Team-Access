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

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    designation VARCHAR(50) UNIQUE,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_type enum('ADMIN','EMPLOYEE', 'INTERN', 'CUSTOMER'),
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    dob DATE,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    UNIQUE(company_id, mobile_number)
);

CREATE TABLE Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    profile_image VARCHAR(255),
    address VARCHAR(255),
    reporting_to INT,
    locations_responsible TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    FOREIGN KEY (reporting_to) REFERENCES Employees(employee_id),
    UNIQUE (company_id, user_id)
);

CREATE TABLE Internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    payment_type ENUM('PAID', 'FREE') DEFAULT 'PAID',
    registration_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE InternAffiliateLinks (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    created_by INT,
    job_details TEXT,
    link VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (created_by) REFERENCES Employees(employee_id)
);

CREATE TABLE Interns (
    intern_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    internship_id INT NOT NULL,
    link_id INT,
    referred_by INT,
    intern_type ENUM('ORGANIZER', 'INFLUENCER'),
    course VARCHAR(255),
    year INT,
    college VARCHAR(255),
    university VARCHAR(255),
    photo VARCHAR(255),
    identity_card VARCHAR(255),
    payment_status ENUM('PAID', 'PENDING'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (internship_id) REFERENCES Internships(internship_id),
    FOREIGN KEY (link_id) REFERENCES internAffiliateLinks(link_id),
    FOREIGN KEY (referred_by) REFERENCES Employees(employee_id)
);

CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('event sponsorship(promote my business)', 'product purchase', 'plan purchase'),
    profile_image VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE (company_id, user_id)
);

CREATE TABLE PaymentOrders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    payment_order_for ENUM('INTERNSHIP', 'EVENT_PARTICIPATION', 'PRODUCT_PURCHASE', 'PROMOTION', 'EVENT_SPONSORSHIP'),
    payment_gateway ENUM('RAZOR_PAY', 'CASH_FREE'),
    payment_method ENUM('CARD', 'NET_BANKING', 'UPI'),
    transaction_id VARCHAR(100),
    payment_status ENUM('PAID', 'PENDING', 'FAILED', 'REFUNDED'),
    payee_type ENUM('EMPLOYEE', 'INTERN', 'CUSTOMER'),
    employee_id INT,
    intern_id INT,
    customer_id INT,
    billing_details TEXT,
    payment_gateway_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (intern_id) REFERENCES Interns(intern_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,    
    company_id INT NOT NULL,
    order_id INT NOT NULL,
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (order_id) REFERENCES PaymentOrders(order_id)
);

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
    event_capacity INT,
    event_image VARCHAR(255),
    status ENUM('UPCOMING', 'PAST', 'CANCELLED'),
    registration_status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    payment_type ENUM('PAID', 'FREE') DEFAULT 'PAID',
    participant_benefits TEXT,
    registration_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

CREATE TABLE EventParticipants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('PAID', 'PENDING'),
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

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
    FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

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

CREATE TABLE ProductReviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    customer_id INT,
    rating INT,
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE ProductCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category INT,
    description TEXT,
    FOREIGN KEY (parent_category) REFERENCES ProductCategories(category_id)
);

CREATE TABLE ProductBrands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    description TEXT,
    brand_logo VARCHAR(255),
    brand_website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProductWishList (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    products TEXT,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    products TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

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