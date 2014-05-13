

var directory = {};

// Initialize Appacitive SDK
Appacitive.initialize({
    apikey: 'kLICDfoSbyuxeQiw36qpcZJv7zeUxNte0sp1hr3oi8U=',
    appId: '57178692622877665',
    env: 'sandbox'
});

// Employee Model
// ----------

// Our basic **Employee** model.
// To use Appacitive as data store
directory.Employee = Appacitive.Object.extend({

    //type name to which this model binds on Appacitive
    typeName: "employee",

    // Default attributes for the emplyee
    defaults: {
        managerid: null,
        managername: ''
    },

    // Returns name formed by concatinating firstnamr and lastname
    name: function() {
        return this.get('firstname') + ' ' + this.get('lastname');
    },

    reportCount: function() {
        var reports = this.aggregate('reports');

        return (reports) ? Math.ceil(reports.all) : 0;
    },

    // To initialize reports collection
    // With all connected reporting employees
    fetchReports: function(options) {
        this.reports = new directory.EmployeeCollection();
        var query = this.getConnectedObjects({
            relation: 'manages',
            label: 'employee',
            fields: ['pic', 'firstname', 'lastname', 'title', '$reports'],
            returnEdge: false
        });

        this.reports.query(query);

        return this.reports.fetch(options);
    },

    // Use projection query to fetch employee details for this employee
    // Returns all employees who report to this employee as well as to whom this employee reports
    fetch: function(options) {
        var self = this;

        // Create grpah projection query by pass employee id
        var query = new Appacitive.Queries.GraphAPI('manages', [this.id]);
        
        // Create a promise
        var promise = Appacitive.Promise.buildPromise(options);
        
        // Call fetch
        query.fetch().then(function(employees) {

            // As we've overrided fetch function we'll need to copy 
            // employee attributes in existing object
            self.copy(employees[0].toJSON(), true);
            
            // Contains all employees who're connected to this employee by manages relationship
            self.children = employees[0].children;

            
            // managedBy contains employees with label `manager` in relation
            // Basically managedBy contains employee to whom this employee directly reports
            var managedBy = self.children.managedby;
            
            // If this employee is managed by any other employye 
            // Then we set managerid and managername property in this e,ployee
            if (managedBy.length > 0) {
                self.set('managerid', managedBy[0].id);
                self.set('managername', managedBy[0].name());
            }

            // Fulfill the promise
            promise.fulfill.apply(promise, [self]);
        }, function() {
            // Reject the promise
            promise.reject.apply(promise, arguments);
        });

        // Return promise
        return promise;
    }

});

// Employee Collection
// ---------------

// The collection of employees is backed by *Appacitive*
directory.EmployeeCollection = Appacitive.Collection.extend(({

    // Reference to this collection's model.
    model: directory.Employee

}));