from rest_framework import permissions

class IsFaculty(permissions.BasePermission):
    """
    Global permission check for Shib Auth Access.
    """
    def has_permission(self, request, view):
        '''Permissible values
            faculty, student, staff, alum, member, affiliate, employee, library-walk-in
        '''
        return True
        resultData = {
            "userId": request.META['uid'],
            "name": request.META['displayName'],
            "affiliation": request.META['eduPersonPrimaryAffiliation'],
            "email": request.META['mail']
        }
        print(resultData)
        return resultData.get("affiliation") == 'employee' or resultData.get("affiliation") == 'faculty'
    
    """def has_object_permission(self, request, view, obj):
        Object level permissions.

        All request methods are checked against the `object_rw_permissions`.
        If None of those permissions returns True the access is denied.

        This is run by REST framework's generic views when `.get_object()` is
        called. If you're writing your own views and want to enforce object
        level permissions, or if you override the get_object method on a
        generic view, then you'll need to explicitly call the
        `.check_object_permissions(request, obj)` method on the view at the
        point at which you've retrieved the object.
        """
        